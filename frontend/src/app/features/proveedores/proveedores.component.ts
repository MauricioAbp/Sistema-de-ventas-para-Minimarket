import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Compras</p>
          <h1>Proveedores</h1>
          <p class="subtitle">Administra los proveedores del minimarket.</p>
        </div>

        <button type="button" class="btn-primary" (click)="openCreateModal()">
          Agregar proveedor
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
          Buscar proveedor
          <input
            placeholder="RUC, razón social o correo"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
          >
        </label>

        <button type="button" class="btn-secondary" (click)="loadProveedores()" [disabled]="loading()">
          Actualizar
        </button>
      </section>

      <section class="panel">
        @if (loading()) {
          <div class="state-box">Cargando proveedores...</div>
        } @else if (!filteredProveedores().length) {
          <div class="state-box">No hay proveedores que coincidan con la búsqueda.</div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>RUC</th>
                  <th>Razón social</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (proveedor of filteredProveedores(); track proveedor.id_proveedor) {
                  <tr>
                    <td>{{ proveedor.ruc_proveedor }}</td>
                    <td>
                      <strong>{{ proveedor.razon_social }}</strong>
                      <span>{{ proveedor.nombre_comercial || 'Sin nombre comercial' }}</span>
                    </td>
                    <td>{{ proveedor.telefono || '-' }}</td>
                    <td>{{ proveedor.correo || '-' }}</td>
                    <td>{{ proveedor.direccion || '-' }}</td>
                    <td>
                      <span class="badge" [class.inactive]="proveedor.activo === false">
                        {{ proveedor.activo === false ? 'Inactivo' : 'Activo' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions">
                        <button type="button" class="btn-link" (click)="openEditModal(proveedor)">Editar</button>
                        <button type="button" class="btn-link danger" (click)="deleteProveedor(proveedor)">Eliminar</button>
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
        <form class="modal" (ngSubmit)="saveProveedor()" (click)="$event.stopPropagation()">          <header>
          <h2>{{ editingProveedor() ? 'Editar proveedor' : 'Nuevo proveedor' }}</h2>            <button type="button" class="icon-button" (click)="closeModal()">×</button>
        </header>

          <label>
            RUC
            <input name="ruc_proveedor" [(ngModel)]="form.ruc_proveedor" required maxlength="20">
          </label>

          <label>
            Razón social
            <input name="razon_social" [(ngModel)]="form.razon_social" required maxlength="120">
          </label>

          <label>
            Nombre comercial
            <input name="nombre_comercial" [(ngModel)]="form.nombre_comercial" maxlength="120">
          </label>

          <label>
            Teléfono
            <input name="telefono" [(ngModel)]="form.telefono" maxlength="30">
          </label>

          <label>
            Correo electrónico
            <input name="correo" [(ngModel)]="form.correo" type="email" maxlength="120">
          </label>

          <label>
            Dirección
            <textarea name="direccion" [(ngModel)]="form.direccion" rows="3" maxlength="200"></textarea>
          </label>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">Cancelar</button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="busy() || !form.ruc_proveedor.trim() || !form.razon_social.trim()"
            >
            {{ busy() ? 'Guardando...' : editingProveedor() ? 'Actualizar' : 'Guardar' }}            </button>
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
      min-width: 980px;
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
      width: min(560px, 100%);
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
export class ProveedoresComponent implements OnInit {
  readonly proveedores = signal<Proveedor[]>([]);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly showModal = signal(false);
  readonly editingProveedor = signal<Proveedor | null>(null);

  form = {
    ruc_proveedor: '',
    razon_social: '',
    nombre_comercial: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  readonly filteredProveedores = computed(() => {
    const term = this.search().trim().toLowerCase();
    const proveedores = this.proveedores();

    if (!term) {
      return proveedores;
    }

    return proveedores.filter((proveedor) =>
      proveedor.ruc_proveedor?.toLowerCase().includes(term) ||
      proveedor.razon_social?.toLowerCase().includes(term) ||
      proveedor.correo?.toLowerCase().includes(term)
    );
  });

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.listProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores.set(proveedores ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de proveedores.');
        this.loading.set(false);
      }
    });
  }

  openCreateModal(): void {
  this.editingProveedor.set(null);
  this.form = {
    ruc_proveedor: '',
    razon_social: '',
    nombre_comercial: '',
    telefono: '',
    correo: '',
    direccion: ''
  };
  this.error.set('');
  this.success.set('');
  this.showModal.set(true);
}
openEditModal(proveedor: Proveedor): void {
  this.editingProveedor.set(proveedor);
  this.form = {
    ruc_proveedor: proveedor.ruc_proveedor,
    razon_social: proveedor.razon_social,
    nombre_comercial: proveedor.nombre_comercial ?? '',
    telefono: proveedor.telefono ?? '',
    correo: proveedor.correo ?? '',
    direccion: proveedor.direccion ?? ''
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

  saveProveedor(): void {
  const ruc = this.form.ruc_proveedor.trim();
  const razonSocial = this.form.razon_social.trim();

  if (!ruc || !razonSocial) {
    return;
  }

  const editing = this.editingProveedor();
  const request: Partial<Proveedor> = {
    ruc_proveedor: ruc,
    razon_social: razonSocial,
    nombre_comercial: this.form.nombre_comercial.trim(),
    telefono: this.form.telefono.trim(),
    correo: this.form.correo.trim(),
    direccion: this.form.direccion.trim(),
    activo: editing?.activo ?? true
  };

  this.busy.set(true);
  this.error.set('');
  this.success.set('');

  const operation = editing
    ? this.pos.updateProveedor(editing.id_proveedor, request)
    : this.pos.createProveedor(request);

  operation.subscribe({
    next: () => {
      this.busy.set(false);
      this.showModal.set(false);
      this.editingProveedor.set(null);
      this.success.set(editing ? 'Proveedor actualizado correctamente.' : 'Proveedor registrado correctamente.');
      this.loadProveedores();
    },
    error: (err) => {
      this.error.set(err.error?.message || 'No se pudo guardar el proveedor.');
      this.busy.set(false);
    }
  });
}
deleteProveedor(proveedor: Proveedor): void {
  const confirmed = confirm(`¿Deseas desactivar el proveedor "${proveedor.razon_social}"?`);

  if (!confirmed) {
    return;
  }

  this.busy.set(true);
  this.error.set('');
  this.success.set('');

  this.pos.deleteProveedor(proveedor.id_proveedor).subscribe({
    next: () => {
      this.busy.set(false);
      this.success.set('Proveedor desactivado correctamente.');
      this.loadProveedores();
    },
    error: (err) => {
      this.error.set(err.error?.message || 'No se pudo desactivar el proveedor.');
      this.busy.set(false);
    }
  });
}
}