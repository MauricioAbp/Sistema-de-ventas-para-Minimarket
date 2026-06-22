import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Catálogo</p>
          <h1>Categorías</h1>
          <p class="subtitle">Administra las familias de productos del minimarket.</p>
        </div>

        <button type="button" class="btn-primary" (click)="openCreateModal()">
          Agregar categoría
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
          Buscar categoría
          <input
            placeholder="Nombre o descripción"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
          >
        </label>

        <button type="button" class="btn-secondary" (click)="loadCategorias()" [disabled]="loading()">
          Actualizar
        </button>
      </section>

      <section class="panel">
        @if (loading()) {
          <div class="state-box">Cargando categorías...</div>
        } @else if (!filteredCategorias().length) {
          <div class="state-box">No hay categorías que coincidan con la búsqueda.</div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de categoría</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (categoria of filteredCategorias(); track categoria.id_categoria) {
                  <tr>
                    <td>#{{ categoria.id_categoria }}</td>
                    <td><strong>{{ categoria.nombre_categoria }}</strong></td>
                    <td>{{ categoria.descripcion || 'Sin descripción' }}</td>
                    <td>
                      <span class="badge" [class.inactive]="categoria.activo === false">
                        {{ categoria.activo === false ? 'Inactiva' : 'Activa' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button type="button" class="btn-link" (click)="openEditModal(categoria)">Editar</button>
                        <button type="button" class="btn-link danger" (click)="deleteCategoria(categoria)">Eliminar</button>
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
        <form class="modal" (ngSubmit)="saveCategoria()" (click)="$event.stopPropagation()">          <header>
            <h2>{{ editingCategoria() ? 'Editar categoría' : 'Nueva categoría' }}</h2>            <button type="button" class="icon-button" (click)="closeModal()">×</button>
          </header>

          <label>
            Nombre de categoría
            <input
              name="nombre_categoria"
              [(ngModel)]="form.nombre_categoria"
              required
              maxlength="80"
            >
          </label>

          <label>
            Descripción
            <textarea
              name="descripcion"
              [(ngModel)]="form.descripcion"
              rows="4"
              maxlength="200"
            ></textarea>
          </label>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="busy() || !form.nombre_categoria.trim()">
              {{ busy() ? 'Guardando...' : editingCategoria() ? 'Actualizar' : 'Guardar' }}            </button>
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

    h1,
    h2 {
      margin: 0;
      color: #0f172a;
    }

    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.1rem;
    }

    .subtitle {
      margin: 6px 0 0;
      color: #64748b;
    }

    .toolbar,
    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .toolbar {
      padding: 14px;
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
      width: min(420px, 100%);
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font: inherit;
      resize: vertical;
    }

    input {
      height: 42px;
    }

    .panel {
      overflow: hidden;
    }

    .table-wrap {
      width: 100%;
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
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
      color: #0f172a;
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

    .actions {
      display: flex;
      gap: 10px;
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

    .banner.success {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
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
      opacity: 0.5;
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

    .btn-link {
      background: transparent;
      color: #2563eb;
      padding: 0;
    }

    .btn-link.danger {
      color: #dc2626;
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
      width: min(480px, 100%);
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

    @media (max-width: 760px) {
      .page-header,
      .toolbar {
        display: grid;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }

      .modal-actions {
        display: grid;
      }
    }
  `]
})
export class CategoriasComponent implements OnInit {
  readonly categorias = signal<Categoria[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly showModal = signal(false);
  readonly editingCategoria = signal<Categoria | null>(null);

  form = {
    nombre_categoria: '',
    descripcion: ''
  };

  readonly filteredCategorias = computed(() => {
    const term = this.search().trim().toLowerCase();
    const categorias = this.categorias();

    if (!term) {
      return categorias;
    }

    return categorias.filter((categoria) =>
      categoria.nombre_categoria?.toLowerCase().includes(term) ||
      categoria.descripcion?.toLowerCase().includes(term)
    );
  });

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.listCategorias().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de categorías.');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
  this.editingCategoria.set(null);
  this.form = {
    nombre_categoria: '',
    descripcion: ''
  };
  this.error.set('');
  this.success.set('');
  this.showModal.set(true);
}
openEditModal(categoria: Categoria): void {
  this.editingCategoria.set(categoria);
  this.form = {
    nombre_categoria: categoria.nombre_categoria,
    descripcion: categoria.descripcion ?? ''
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

  saveCategoria(): void {
    const nombre = this.form.nombre_categoria.trim();
    if (!nombre) {
      return;
    }
    const editing = this.editingCategoria();
    const request: Partial<Categoria> = {
      nombre_categoria: nombre,
      descripcion: this.form.descripcion.trim(),
      activo: editing?.activo ?? true
    };
    this.busy.set(true);
    this.error.set('');
    this.success.set('');
    const operation = editing
    ? this.pos.updateCategoria(editing.id_categoria, request)
    : this.pos.createCategoria(request);
    operation.subscribe({
      next: () => {
        this.busy.set(false);
        this.showModal.set(false);
        this.editingCategoria.set(null);
        this.success.set(editing ? 'Categoría actualizada correctamente.' : 'Categoría registrada correctamente.');
        this.loadCategorias();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo guardar la categoría.');
        this.busy.set(false);
      }
    });
  }
  deleteCategoria(categoria: Categoria): void {
  const confirmed = confirm(`¿Deseas desactivar la categoría "${categoria.nombre_categoria}"?`);

  if (!confirmed) {
    return;
  }

  this.busy.set(true);
  this.error.set('');
  this.success.set('');

  this.pos.deleteCategoria(categoria.id_categoria).subscribe({
    next: () => {
      this.busy.set(false);
      this.success.set('Categoría desactivada correctamente.');
      this.loadCategorias();
    },
    error: (err) => {
      this.error.set(err.error?.message || 'No se pudo desactivar la categoría.');
      this.busy.set(false);
    }
  });
}
}