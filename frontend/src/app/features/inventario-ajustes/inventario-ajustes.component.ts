import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto, Proveedor } from '../../core/models/pos.models';
import { AuthService } from '../../core/services/auth.service';
import { PosService } from '../../core/services/pos.service';

@Component({
  selector: 'app-inventario-ajustes',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Inventario</p>
          <h1>Entradas y ajustes</h1>
          <p class="subtitle">Registra reposiciones de mercadería y correcciones de stock.</p>
        </div>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      @if (success()) {
        <p class="banner success">{{ success() }}</p>
      }

      <section class="grid">
        <form class="panel" (ngSubmit)="save()">
          <h2>Nuevo movimiento</h2>

          <label>
            Producto
            <select name="idProducto" [(ngModel)]="form.idProducto" required>
              <option [ngValue]="null">Seleccionar producto</option>
              @for (product of activeProducts(); track product.id_producto) {
                <option [ngValue]="product.id_producto">
                  {{ product.codigo_producto }} - {{ product.nombre_producto }}
                </option>
              }
            </select>
          </label>

          @if (selectedProduct(); as product) {
            <div class="product-summary">
              <span>Stock actual</span>
              <strong>{{ product.stock_actual }}</strong>
              <span>Precio venta</span>
              <strong>S/ {{ asNumber(product.precio_venta) | number: '1.2-2' }}</strong>
            </div>
          }

          <label>
            Tipo de movimiento
            <select name="tipoMovimiento" [(ngModel)]="form.tipoMovimiento" required>
              <option value="ENTRADA">Entrada de mercadería</option>
              <option value="AJUSTE">Ajuste manual</option>
            </select>
          </label>

          @if (form.tipoMovimiento === 'ENTRADA') {
            <label>
              Proveedor
              <select name="idProveedor" [(ngModel)]="form.idProveedor" required>
                <option [ngValue]="null">Seleccionar proveedor</option>
                @for (proveedor of proveedores(); track proveedor.id_proveedor) {
                  <option [ngValue]="proveedor.id_proveedor">
                    {{ proveedor.ruc_proveedor }} - {{ proveedor.razon_social }}
                  </option>
                }
              </select>
            </label>
          }

          <label>
            {{ form.tipoMovimiento === 'AJUSTE' ? 'Stock final deseado' : 'Cantidad a ingresar' }}
            <input type="number" min="0" step="1" name="cantidad" [(ngModel)]="form.cantidad" required>
          </label>

          @if (selectedProduct()) {
            <div class="stock-preview" [class.warning]="form.tipoMovimiento === 'AJUSTE'">
              <span>Stock nuevo</span>
              <strong>{{ stockNuevo() }}</strong>
            </div>
          }

          <label>
            Motivo
            <textarea name="motivo" rows="4" [(ngModel)]="form.motivo" maxlength="250" required></textarea>
          </label>

          <div class="actions">
            <button type="button" class="btn-secondary" (click)="reset()">Limpiar</button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="busy() || !form.idProducto || !form.motivo.trim() || (form.tipoMovimiento === 'ENTRADA' && !form.idProveedor)"
            >
              {{ busy() ? 'Guardando...' : 'Registrar movimiento' }}
            </button>
          </div>
        </form>

        <section class="panel help-panel">
          <h2>Cómo funciona</h2>

          <div>
            <strong>Entrada</strong>
            <p>Suma la cantidad indicada al stock actual. Úsalo cuando recibes mercadería nueva. Requiere proveedor.</p>
          </div>

          <div>
            <strong>Ajuste manual</strong>
            <p>Deja el stock final exactamente en la cantidad indicada. Úsalo para corregir diferencias del conteo físico.</p>
          </div>

          <div>
            <strong>Historial</strong>
            <p>Después de guardar, el movimiento aparecerá en el módulo Movimientos de stock.</p>
          </div>
        </section>
      </section>
    </section>
  `,
  styles: [`
    .page {
      display: grid;
      gap: 18px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .eyebrow {
      margin: 0 0 4px;
      color: #2563eb;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      color: #0f172a;
      font-size: 1.8rem;
    }

    h2 {
      color: #0f172a;
      font-size: 1.05rem;
    }

    .subtitle {
      margin-top: 6px;
      color: #64748b;
    }

    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
      gap: 16px;
      align-items: start;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      display: grid;
      gap: 14px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
    }

    input,
    select,
    textarea {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font: inherit;
    }

    input,
    select {
      height: 42px;
    }

    textarea {
      resize: vertical;
    }

    .product-summary {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px 12px;
    }

    .product-summary span,
    .stock-preview span {
      color: #64748b;
      font-weight: 700;
    }

    .product-summary strong,
    .stock-preview strong {
      color: #0f172a;
    }

    .stock-preview {
      border-radius: 8px;
      padding: 12px;
      background: #ecfdf5;
      color: #047857;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-weight: 800;
    }

    .stock-preview.warning {
      background: #fffbeb;
      color: #92400e;
    }

    .help-panel div {
      display: grid;
      gap: 4px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
    }

    .help-panel strong {
      color: #0f172a;
    }

    .help-panel p {
      color: #64748b;
      line-height: 1.45;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .banner {
      border-radius: 8px;
      padding: 14px 16px;
    }

    .banner.error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .banner.success {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }

    button {
      border: 0;
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }

    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }

    .btn-secondary {
      background: #e0f2fe;
      color: #075985;
    }

    @media (max-width: 900px) {
      .grid,
      .page-header {
        grid-template-columns: 1fr;
        display: grid;
      }

      .actions {
        display: grid;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class InventarioAjustesComponent implements OnInit {
  readonly products = signal<Producto[]>([]);
  readonly proveedores = signal<Proveedor[]>([]);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  form: {
    idProducto: number | null;
    idProveedor: number | null;
    tipoMovimiento: 'ENTRADA' | 'AJUSTE';
    cantidad: number;
    motivo: string;
  } = {
    idProducto: null,
    idProveedor: null,
    tipoMovimiento: 'ENTRADA',
    cantidad: 0,
    motivo: ''
  };

  readonly activeProducts = computed(() =>
    this.products().filter((product) => product.activo !== false)
  );

  readonly selectedProduct = computed(() =>
    this.products().find((product) => product.id_producto === this.form.idProducto) ?? null
  );

  readonly stockNuevo = computed(() => {
    const product = this.selectedProduct();
    if (!product) {
      return 0;
    }

    const current = Number(product.stock_actual ?? 0);
    const cantidad = Number(this.form.cantidad ?? 0);

    return this.form.tipoMovimiento === 'ENTRADA'
      ? current + cantidad
      : cantidad;
  });

  constructor(private pos: PosService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadProveedores();
  }

  loadProducts(): void {
    this.pos.listAllProducts().subscribe({
      next: (products) => {
        this.products.set(products ?? []);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de productos.');
      }
    });
  }

  loadProveedores(): void {
    this.pos.listProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores.set((proveedores ?? []).filter((proveedor) => proveedor.activo !== false));
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de proveedores.');
      }
    });
  }

  save(): void {
    const user = this.auth.currentUser();

    if (!user || !this.form.idProducto || !this.form.motivo.trim()) {
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.ajustarInventario({
      idProducto: this.form.idProducto,
      idUsuario: user.idUsuario,
      idProveedor: this.form.tipoMovimiento === 'ENTRADA'
        ? this.form.idProveedor ?? undefined
        : undefined,
      tipoMovimiento: this.form.tipoMovimiento,
      cantidad: Number(this.form.cantidad ?? 0),
      motivo: this.form.motivo.trim()
    }).subscribe({
      next: () => {
        this.success.set('Movimiento registrado correctamente.');
        this.busy.set(false);
        this.reset();
        this.loadProducts();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo registrar el movimiento.');
        this.busy.set(false);
      }
    });
  }

  reset(): void {
    this.form = {
      idProducto: null,
      idProveedor: null,
      tipoMovimiento: 'ENTRADA',
      cantidad: 0,
      motivo: ''
    };
  }

  asNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0);
  }
}