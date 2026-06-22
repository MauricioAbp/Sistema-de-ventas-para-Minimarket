import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria, Producto } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Inventario</p>
          <h1>Productos</h1>
          <p class="subtitle">Consulta productos, precios y niveles de stock.</p>
        </div>

       <button type="button" class="btn-primary" (click)="openCreateModal()">
        Nuevo producto
      </button>
    </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }
      @if (success()) {
  <p class="banner success">{{ success() }}</p>
}

      <section class="toolbar">
        <label>
          Buscar producto
          <input
            placeholder="Código o nombre"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
          >
        </label>

        <button type="button" class="btn-secondary" (click)="loadProducts()" [disabled]="loading()">
          Actualizar
        </button>
      </section>

      <section class="panel">
        @if (loading()) {
          <div class="state-box">Cargando productos...</div>
        } @else if (!filteredProducts().length) {
          <div class="state-box">No hay productos que coincidan con la búsqueda.</div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio venta</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (product of filteredProducts(); track product.id_producto) {
                  <tr>
                    <td>{{ product.codigo_producto }}</td>
                    <td>
                      <strong>{{ product.nombre_producto }}</strong>
                      <span>{{ product.descripcion || 'Sin descripción' }}</span>
                    </td>
                    <td>{{ product.categoria?.nombre_categoria || 'Sin categoría' }}</td>
                    <td>S/ {{ asNumber(product.precio_venta) | number: '1.2-2' }}</td>
                    <td>
                      <span class="stock" [class.low]="isLowStock(product)">
                        {{ product.stock_actual }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" [class.inactive]="product.activo === false">
                        {{ product.activo === false ? 'Inactivo' : 'Activo' }}
                      </span>
                    </td>
                    <td>
  <div class="actions">
    <button type="button" class="btn-link" (click)="openEditModal(product)">Editar</button>
    <button type="button" class="btn-link danger" (click)="deleteProduct(product)">Eliminar</button>
  </div>
</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    </section>
    @if (showModal()) {
  <div class="modal-backdrop" (click)="closeModal()">
<form class="modal" (ngSubmit)="saveProduct()" (click)="$event.stopPropagation()">      <header>
<h2>{{ editingProduct() ? 'Editar producto' : 'Nuevo producto' }}</h2>        <button type="button" class="icon-button" (click)="closeModal()">×</button>
      </header>

      <label>
        Categoría
        <select name="id_categoria" [(ngModel)]="form.id_categoria" required>
  <option value="">Seleccionar categoría</option>

  @for (categoria of categorias(); track categoria.id_categoria) {
    <option [value]="categoria.id_categoria">
      {{ categoria.nombre_categoria }}
    </option>
  }
</select>

@if (!categorias().length) {
  <small class="field-hint">No hay categorías disponibles. Crea una categoría activa primero.</small>
}
      </label>

      <label>
        Código
        <input name="codigo_producto" [(ngModel)]="form.codigo_producto" required maxlength="50">
      </label>

      <label>
        Nombre
        <input name="nombre_producto" [(ngModel)]="form.nombre_producto" required maxlength="120">
      </label>

      <label>
        Descripción
        <textarea name="descripcion" [(ngModel)]="form.descripcion" rows="3" maxlength="200"></textarea>
      </label>

      <div class="form-grid">
        <label>
          Precio compra
          <input type="number" min="0" step="0.01" name="precio_compra" [(ngModel)]="form.precio_compra">
        </label>

        <label>
          Precio venta
          <input type="number" min="0" step="0.01" name="precio_venta" [(ngModel)]="form.precio_venta" required>
        </label>

        <label>
          Stock actual
          <input type="number" min="0" step="1" name="stock_actual" [(ngModel)]="form.stock_actual" required>
        </label>

        <label>
          Stock mínimo
          <input type="number" min="0" step="1" name="stock_minimo" [(ngModel)]="form.stock_minimo">
        </label>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-secondary" (click)="closeModal()">Cancelar</button>
        <button
          type="submit"
          class="btn-primary"
          [disabled]="busy() || !form.id_categoria || !form.codigo_producto.trim() || !form.nombre_producto.trim()"
        >
{{ busy() ? 'Guardando...' : editingProduct() ? 'Actualizar' : 'Guardar' }}        </button>
      </div>
    </form>
  </div>
}
  `,

  styles: [`
    .page {
      display: grid;
      gap: 18px;
    }

    .banner.success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

select,
textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
}
.field-hint {
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
}


select {
  height: 42px;
}
.actions {
  display: flex;
  gap: 10px;
}

.btn-link {
  background: transparent;
  color: #2563eb;
  padding: 0;
}

.btn-link.danger {
  color: #dc2626;
}

textarea {
  resize: vertical;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 50;
}

.modal {
  width: min(620px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 18px;
  display: grid;
  gap: 14px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
}

.modal header,
.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.modal-actions {
  justify-content: flex-end;
}

.icon-button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  background: #f1f5f9;
  color: #334155;
  font-size: 1.3rem;
  line-height: 1;
}

    .page-header,
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .eyebrow {
      margin: 0 0 4px;
      color: #2563eb;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: #0f172a;
      font-size: 1.8rem;
    }

    .subtitle {
      margin: 6px 0 0;
      color: #64748b;
    }

    .toolbar {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
      width: min(420px, 100%);
    }

    input {
      height: 42px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0 12px;
      font: inherit;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
      overflow: hidden;
    }

    .table-wrap {
      width: 100%;
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 860px;
    }

    th,
    td {
      padding: 13px 14px;
      text-align: left;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    th {
      background: #f8fafc;
      color: #475569;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    td {
      color: #334155;
    }

    td strong {
      display: block;
      color: #0f172a;
    }

    td span {
      color: #64748b;
      font-size: 0.9rem;
    }

    .stock {
      display: inline-flex;
      min-width: 42px;
      justify-content: center;
      border-radius: 999px;
      background: #dcfce7;
      color: #166534;
      padding: 4px 8px;
      font-weight: 800;
    }

    .stock.low {
      background: #fef3c7;
      color: #92400e;
    }

    .badge {
      display: inline-flex;
      border-radius: 999px;
      background: #dbeafe;
      color: #1d4ed8;
      padding: 4px 8px;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .banner,
    .state-box {
      border-radius: 8px;
      padding: 14px 16px;
    }

    .banner.error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .state-box {
      min-height: 180px;
      display: grid;
      place-items: center;
      color: #64748b;
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

    @media (max-width: 760px) {
      .page-header,
      .toolbar {
        display: grid;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class ProductosComponent implements OnInit {
  readonly products = signal<Producto[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly error = signal('');
  readonly categorias = signal<Categoria[]>([]);
  readonly busy = signal(false);
  readonly success = signal('');
  readonly showModal = signal(false);
  readonly editingProduct = signal<Producto | null>(null);
  form = {
    id_categoria: '',
    codigo_producto: '',
    nombre_producto: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 5
  };
  readonly filteredProducts = computed(() => {
    const term = this.search().trim().toLowerCase();
    const products = this.products();

    if (!term) {
      return products;
    }

    return products.filter((product) =>
      product.codigo_producto?.toLowerCase().includes(term) ||
      product.nombre_producto?.toLowerCase().includes(term)
    );
  });

  constructor(private pos: PosService) {}

  ngOnInit(): void {
  this.loadProducts();
  this.loadCategorias();
}
  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.pos.listAllProducts().subscribe({
      next: (products) => {
        this.products.set(products ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de productos.');
        this.loading.set(false);
      }
    });
  }
  loadCategorias(): void {
  this.pos.listCategorias().subscribe({
    next: (categorias) => {
      this.categorias.set((categorias ?? []).filter((categoria) => categoria.activo !== false));
    },
    error: () => {
      this.error.set('No se pudo cargar la lista de categorías.');
    }
  });
}
openCreateModal(): void {
  this.editingProduct.set(null);

  this.form = {
    id_categoria: '',
    codigo_producto: '',
    nombre_producto: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 5
  };

  this.error.set('');
  this.success.set('');
  this.showModal.set(true);
}
openEditModal(product: Producto): void {
  this.editingProduct.set(product);

  this.form = {
    id_categoria: product.categoria?.id_categoria ? String(product.categoria.id_categoria) : '',
    codigo_producto: product.codigo_producto ?? '',
    nombre_producto: product.nombre_producto ?? '',
    descripcion: product.descripcion ?? '',
    precio_compra: this.asNumber(product.precio_compra),
    precio_venta: this.asNumber(product.precio_venta),
    stock_actual: Number(product.stock_actual ?? 0),
    stock_minimo: Number(product.stock_minimo ?? 5)
  };

  this.error.set('');
  this.success.set('');
  this.showModal.set(true);
}
closeModal(): void {
  if (this.busy()) {
    return;
  }

  this.showModal.set(false);
}

saveProduct(): void {
  const idCategoria = Number(this.form.id_categoria);
  const codigo = this.form.codigo_producto.trim();
  const nombre = this.form.nombre_producto.trim();

  if (!idCategoria || !codigo || !nombre) {
    return;
  }

  const editing = this.editingProduct();

  const request: Partial<Producto> = {
    categoria: {
      id_categoria: idCategoria
    },
    codigo_producto: codigo,
    nombre_producto: nombre,
    descripcion: this.form.descripcion.trim(),
    precio_compra: Number(this.form.precio_compra ?? 0),
    precio_venta: Number(this.form.precio_venta ?? 0),
    stock_actual: Number(this.form.stock_actual ?? 0),
    stock_minimo: Number(this.form.stock_minimo ?? 0),
    activo: editing?.activo ?? true
  };

  this.busy.set(true);
  this.error.set('');
  this.success.set('');

  const operation = editing
    ? this.pos.updateProduct(editing.id_producto, request)
    : this.pos.createProduct(request);

  operation.subscribe({
    next: () => {
      this.busy.set(false);
      this.showModal.set(false);
      this.editingProduct.set(null);
      this.success.set(editing ? 'Producto actualizado correctamente.' : 'Producto registrado correctamente.');
      this.loadProducts();
    },
    error: (err) => {
      this.error.set(err.error?.message || 'No se pudo guardar el producto.');
      this.busy.set(false);
    }
  });
}
deleteProduct(product: Producto): void {
  const confirmed = confirm(`¿Deseas desactivar el producto "${product.nombre_producto}"?`);

  if (!confirmed) {
    return;
  }

  this.busy.set(true);
  this.error.set('');
  this.success.set('');

  this.pos.deleteProduct(product.id_producto).subscribe({
    next: () => {
      this.busy.set(false);
      this.success.set('Producto desactivado correctamente.');
      this.loadProducts();
    },
    error: (err) => {
      this.error.set(err.error?.message || 'No se pudo desactivar el producto.');
      this.busy.set(false);
    }
  });
}
  isLowStock(product: Producto): boolean {
    const current = product.stock_actual ?? 0;
    const minimum = product.stock_minimo ?? 5;
    return current <= minimum;
  }

  asNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0);
  }
}