import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { PosService } from '../../core/services/pos.service';
import { CartLine, Producto, VentaResponse } from '../../core/models/pos.models';

@Component({
  selector: 'app-pos',
  standalone: true,
imports: [FormsModule, DecimalPipe, RouterLink],  
templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {
  readonly products = signal<Producto[]>([]);
  readonly cart = signal<CartLine[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly idCaja = signal<number | null>(null);
  readonly showCheckout = signal(false);
  readonly showOpenCaja = signal(false);
  readonly lastSale = signal<VentaResponse | null>(null);

  montoRecibido = 0;
  metodoPago = 'EFECTIVO';
  montoApertura = 100;

  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    const items = this.products().filter((p) => p.activo !== false);

    if (!term) {
      return items;
    }

    return items.filter(
      (p) =>
        p.codigo_producto?.toLowerCase().includes(term) ||
        p.nombre_producto?.toLowerCase().includes(term)
    );
  });

  readonly subtotal = computed(() =>
    this.cart().reduce(
      (sum, line) => sum + this.asNumber(line.product.precio_venta) * line.cantidad,
      0
    )
  );

  readonly igv = computed(() => Math.round(this.subtotal() * 0.18 * 100) / 100);
  readonly total = computed(() => Math.round((this.subtotal() + this.igv()) * 100) / 100);
  readonly itemCount = computed(() => this.cart().reduce((sum, line) => sum + line.cantidad, 0));

  constructor(
    private pos: PosService,
    private auth: AuthService,
    private router: Router
  ) {}

  get userLabel(): string {
    const user = this.auth.currentUser();
    if (!user) {
      return '';
    }
    return `${user.nombre} ${user.apellido}`.trim();
  }

  ngOnInit(): void {
    if (!this.auth.currentUser()) {
      void this.router.navigate(['/login']);
      return;
    }

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      products: this.pos.listProducts(),
      cajas: this.pos.listCajas()
    }).subscribe({
      next: ({ products, cajas }) => {
        this.products.set(products ?? []);
        this.resolveOpenCaja(cajas ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el punto de venta. Verifica que el backend este activo.');
        this.loading.set(false);
      }
    });
  }

  private resolveOpenCaja(cajas: { id_caja: number; estado: string; usuario?: { id_usuario?: number } }[]): void {
    const userId = this.auth.currentUser()?.idUsuario;
    const open = cajas.find((c) => {
      if (c.estado?.toUpperCase() !== 'ABIERTA') {
        return false;
      }
      const ownerId = c.usuario?.id_usuario;
      return ownerId == null || ownerId === userId;
    });

    if (open) {
      this.idCaja.set(open.id_caja);
      this.showOpenCaja.set(false);
      return;
    }

    this.idCaja.set(null);
    this.showOpenCaja.set(true);
  }

  openCaja(): void {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }

    this.busy.set(true);
    this.error.set('');

    this.pos
      .openCaja({
        idUsuario: user.idUsuario,
        montoApertura: this.montoApertura
      })
      .subscribe({
        next: (caja) => {
          this.idCaja.set(caja.id_caja);
          this.showOpenCaja.set(false);
          this.busy.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'No se pudo abrir la caja');
          this.busy.set(false);
        }
      });
  }

  addToCart(product: Producto): void {
    if ((product.stock_actual ?? 0) <= 0) {
      this.error.set('Producto sin stock disponible');
      return;
    }

    this.error.set('');
    const lines = [...this.cart()];
    const index = lines.findIndex((line) => line.product.id_producto === product.id_producto);

    if (index >= 0) {
      const nextQty = lines[index].cantidad + 1;
      if (nextQty > (product.stock_actual ?? 0)) {
        this.error.set('Stock insuficiente para agregar mas unidades');
        return;
      }
      lines[index] = { ...lines[index], cantidad: nextQty };
    } else {
      lines.push({ product, cantidad: 1 });
    }

    this.cart.set(lines);
  }

  changeQty(line: CartLine, delta: number): void {
    const lines = this.cart().map((item) => {
      if (item.product.id_producto !== line.product.id_producto) {
        return item;
      }

      const next = item.cantidad + delta;
      if (next <= 0) {
        return null;
      }

      if (next > (item.product.stock_actual ?? 0)) {
        this.error.set('Stock insuficiente');
        return item;
      }

      this.error.set('');
      return { ...item, cantidad: next };
    });

    this.cart.set(lines.filter((item): item is CartLine => item !== null));
  }

  removeLine(line: CartLine): void {
    this.cart.set(this.cart().filter((item) => item.product.id_producto !== line.product.id_producto));
  }

  clearCart(): void {
    this.cart.set([]);
    this.error.set('');
  }

  openCheckout(): void {
    if (!this.cart().length || !this.idCaja()) {
      return;
    }
    this.montoRecibido = this.total();
    this.showCheckout.set(true);
    this.lastSale.set(null);
  }

  closeCheckout(): void {
    this.showCheckout.set(false);
  }

  confirmSale(): void {
    const user = this.auth.currentUser();
    const cajaId = this.idCaja();

    if (!user || !cajaId || !this.cart().length) {
      return;
    }

    if (this.montoRecibido < this.total()) {
      this.error.set('El monto recibido debe cubrir el total');
      return;
    }

    this.busy.set(true);
    this.error.set('');

    this.pos
      .registerSale({
        idCaja: cajaId,
        idUsuario: user.idUsuario,
        montoRecibido: this.montoRecibido,
        metodoPago: this.metodoPago,
        detalles: this.cart().map((line) => ({
          idProducto: line.product.id_producto,
          cantidad: line.cantidad
        }))
      })
      .subscribe({
        next: (sale) => {
          this.lastSale.set(sale);
          this.cart.set([]);
          this.showCheckout.set(false);
          this.busy.set(false);
          this.loadInitialData();
        },
        error: (err) => {
          this.error.set(err.error?.message || 'No se pudo registrar la venta');
          this.busy.set(false);
        }
      });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  lineSubtotal(line: CartLine): number {
    return this.asNumber(line.product.precio_venta) * line.cantidad;
  }

  asNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0);
  }
}
