import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Empresa } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Sistema</p>
          <h1>Configuración</h1>
          <p class="subtitle">Datos del minimarket usados en boletas y documentos.</p>
        </div>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      @if (success()) {
        <p class="banner success">{{ success() }}</p>
      }

      @if (loading()) {
        <div class="state-box">Cargando configuración...</div>
      } @else {
        <form class="panel" (ngSubmit)="save()">
          <section class="form-grid">
            <label>
              RUC
              <input name="ruc" [(ngModel)]="form.ruc" maxlength="20">
            </label>

            <label>
              Razón social
              <input name="razon_social" [(ngModel)]="form.razon_social" maxlength="150">
            </label>

            <label>
              Nombre comercial
              <input name="nombre_comercial" [(ngModel)]="form.nombre_comercial" maxlength="150">
            </label>

            <label>
              Teléfono
              <input name="telefono" [(ngModel)]="form.telefono" maxlength="30">
            </label>

            <label>
              Correo
              <input name="correo" [(ngModel)]="form.correo" type="email" maxlength="120">
            </label>

            <label>
              IGV (%)
              <input name="igv_porcentaje" type="number" min="0" step="0.01" [(ngModel)]="form.igv_porcentaje">
            </label>

            <label class="full">
              Dirección
              <textarea name="direccion" rows="3" [(ngModel)]="form.direccion" maxlength="250"></textarea>
            </label>
          </section>

          <section class="preview">
            <h2>Vista previa de boleta</h2>
            <div class="receipt-preview">
              <strong>{{ form.nombre_comercial || 'Minimarket' }}</strong>
              <span>{{ form.razon_social || 'Razón social' }}</span>
              <span>RUC: {{ form.ruc || '-' }}</span>
              <span>{{ form.direccion || 'Dirección' }}</span>
              <span>IGV: {{ asNumber(form.igv_porcentaje) | number: '1.2-2' }}%</span>
            </div>
          </section>

          <div class="actions">
            <button type="button" class="btn-secondary" (click)="load()">Restaurar</button>
            <button type="submit" class="btn-primary" [disabled]="busy()">
              {{ busy() ? 'Guardando...' : 'Guardar configuración' }}
            </button>
          </div>
        </form>
      }
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
    h2 {
      margin: 0;
      color: #0f172a;
    }

    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.05rem;
    }

    .subtitle {
      margin: 6px 0 0;
      color: #64748b;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      display: grid;
      gap: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
    }

    .full {
      grid-column: 1 / -1;
    }

    input,
    textarea {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font: inherit;
    }

    input {
      height: 42px;
    }

    textarea {
      resize: vertical;
    }

    .preview {
      display: grid;
      gap: 10px;
    }

    .receipt-preview {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      display: grid;
      gap: 4px;
      width: min(420px, 100%);
      background: #f8fafc;
    }

    .receipt-preview strong {
      color: #0f172a;
      font-size: 1.1rem;
    }

    .receipt-preview span {
      color: #64748b;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
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
      min-height: 160px;
      display: grid;
      place-items: center;
      color: #64748b;
      border: 1px dashed #cbd5e1;
      background: #ffffff;
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
      .form-grid,
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
export class ConfiguracionComponent implements OnInit {
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  form: Empresa = {
    ruc: '',
    razon_social: '',
    nombre_comercial: '',
    direccion: '',
    telefono: '',
    correo: '',
    igv_porcentaje: 18
  };

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.getEmpresaPrincipal().subscribe({
      next: (empresa) => {
        this.form = {
          ...empresa,
          igv_porcentaje: this.asNumber(empresa.igv_porcentaje ?? 18)
        };
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la configuración de empresa.');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    this.busy.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.saveEmpresaPrincipal({
      ...this.form,
      igv_porcentaje: this.asNumber(this.form.igv_porcentaje)
    }).subscribe({
      next: (empresa) => {
        this.form = {
          ...empresa,
          igv_porcentaje: this.asNumber(empresa.igv_porcentaje ?? 18)
        };
        this.success.set('Configuración guardada correctamente.');
        this.busy.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo guardar la configuración.');
        this.busy.set(false);
      }
    });
  }

  asNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0);
  }
}