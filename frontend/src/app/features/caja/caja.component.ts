import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PosService } from '../../core/services/pos.service';
import { Caja, CajaResumenResponse } from '../../core/models/pos.models';
@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Gestión de caja</p>
          <h1>Caja</h1>
          <p class="subtitle">Apertura, cierre y control del turno actual.</p>
        </div>
        <button type="button" class="btn-secondary" (click)="loadCajas()" [disabled]="loading()">
          Actualizar
        </button>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      @if (success()) {
        <p class="banner success">{{ success() }}</p>
      }

      @if (loading()) {
        <div class="state-box">Cargando información de caja...</div>
      } @else {
        <div class="grid">
          <section class="panel">
            <h2>Estado actual</h2>

            @if (openCaja(); as caja) {
              <div class="status open">Caja abierta</div>
              <dl>
                <div>
                  <dt>Número de caja</dt>
                  <dd>#{{ caja.id_caja }}</dd>
                </div>
                <div>
                  <dt>Monto de apertura</dt>
                  <dd>S/ {{ asNumber(caja.monto_apertura) | number: '1.2-2' }}</dd>
                </div>
                <div>
                  <dt>Estado</dt>
                  <dd>{{ caja.estado }}</dd>
                </div>
              </dl>
            } @else {
              <div class="status closed">Sin caja abierta</div>
              <p class="muted">Debes abrir una caja para registrar ventas.</p>
            }
          </section>

          @if (!openCaja()) {
            <form class="panel form-panel" (ngSubmit)="openNewCaja()">
              <h2>Abrir caja</h2>

              <label>
                Monto inicial (S/)
                <input type="number" min="0" step="0.01" [(ngModel)]="montoApertura" name="montoApertura" required>
              </label>

              <button type="submit" class="btn-primary" [disabled]="busy()">
                {{ busy() ? 'Abriendo...' : 'Abrir caja' }}
              </button>
            </form>
          } @else {
            <form class="panel form-panel" (ngSubmit)="closeCurrentCaja()">
              <h2>Cerrar caja</h2>
              @if (resumen(); as data) {
  <div class="cash-summary">
    <div>
      <span>Monto apertura</span>
      <strong>S/ {{ asNumber(data.montoApertura) | number: '1.2-2' }}</strong>
    </div>
    <div>
      <span>Total vendido</span>
      <strong>S/ {{ asNumber(data.totalVendido) | number: '1.2-2' }}</strong>
    </div>
    <div>
      <span>Total efectivo</span>
      <strong>S/ {{ asNumber(data.totalEfectivo) | number: '1.2-2' }}</strong>
    </div>
    <div class="expected">
      <span>Monto esperado</span>
      <strong>S/ {{ asNumber(data.montoEsperado) | number: '1.2-2' }}</strong>
    </div>
  </div>

  <div class="method-summary">
    @for (method of metodoEntries(data.ventasPorMetodo); track method.name) {
      <div>
        <span>{{ method.name }}</span>
        <strong>S/ {{ method.total | number: '1.2-2' }}</strong>
      </div>
    }
  </div>
}

              <label>
                Monto contado (S/)
                <input type="number" min="0" step="0.01" [(ngModel)]="montoContado" name="montoContado" required>
              </label>

              <label>
                Observaciones
                <textarea [(ngModel)]="observaciones" name="observaciones" rows="4"></textarea>
              </label>

              <div class="difference" [class.ok]="diferencia() === 0" [class.bad]="diferencia() !== 0">
                <span>Diferencia estimada</span>
                <strong>S/ {{ diferencia() | number: '1.2-2' }}</strong>
              </div>

              <button type="submit" class="btn-danger" [disabled]="busy()">
                {{ busy() ? 'Cerrando...' : 'Cerrar caja' }}
              </button>
            </form>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .page {
      display: grid;
      gap: 20px;
    }

    .page-header {
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

    h1, h2 {
      margin: 0;
      color: #0f172a;
    }

    h1 {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.05rem;
    }

    .subtitle,
    .muted {
      margin: 6px 0 0;
      color: #64748b;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      align-items: start;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 18px;
      display: grid;
      gap: 16px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .form-panel {
      gap: 14px;
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
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

    .status {
      width: fit-content;
      border-radius: 999px;
      padding: 6px 10px;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .status.open {
      background: #dcfce7;
      color: #166534;
    }

    .status.closed {
      background: #fee2e2;
      color: #991b1b;
    }

    dl {
      display: grid;
      gap: 12px;
      margin: 0;
    }

    dl div {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }

    dt {
      color: #64748b;
      font-weight: 700;
    }

    dd {
      margin: 0;
      color: #0f172a;
      font-weight: 800;
    }

    .difference {
      border-radius: 8px;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-weight: 800;
    }

    .difference.ok {
      background: #dcfce7;
      color: #166534;
    }

    .difference.bad {
      background: #fee2e2;
      color: #991b1b;
    }

    .banner,
    .state-box {
      border-radius: 8px;
      padding: 14px 16px;
    }

    .state-box {
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      color: #64748b;
      min-height: 160px;
      display: grid;
      place-items: center;
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
    }

    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .cash-summary,
.method-summary {
  display: grid;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.cash-summary div,
.method-summary div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.cash-summary span,
.method-summary span {
  color: #64748b;
  font-weight: 700;
}

.cash-summary strong,
.method-summary strong {
  color: #0f172a;
}

.cash-summary .expected {
  border-top: 1px solid #e2e8f0;
  padding-top: 10px;
}

.cash-summary .expected strong {
  color: #2563eb;
}

    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }

    .btn-secondary {
      background: #e0f2fe;
      color: #075985;
    }

    .btn-danger {
      background: #ef4444;
      color: #ffffff;
    }

    @media (max-width: 800px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        display: grid;
      }
    }
  `]
})
export class CajaComponent implements OnInit {
  readonly cajas = signal<Caja[]>([]);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly resumen = signal<CajaResumenResponse | null>(null);

  montoApertura = 100;
  montoContado = 0;
  observaciones = '';

  readonly openCaja = computed(() => {
    const userId = this.auth.currentUser()?.idUsuario;
    return this.cajas().find((caja) => {
      const isOpen = caja.estado?.toUpperCase() === 'ABIERTA';
      const ownerId = caja.usuario?.id_usuario;
      return isOpen && (ownerId == null || ownerId === userId);
    }) ?? null;
  });

  readonly diferencia = computed(() => {
  const resumen = this.resumen();
  const esperado = resumen ? this.asNumber(resumen.montoEsperado) : 0;
  return Math.round((this.montoContado - esperado) * 100) / 100;
});

  constructor(private pos: PosService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadCajas();
  }

  loadCajas(): void {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.listCajas().subscribe({
      next: (cajas) => {
        this.cajas.set(cajas ?? []);
        const abierta = this.openCaja();

if (abierta) {
  this.loadResumen(abierta.id_caja);
} else {
  this.resumen.set(null);
}

this.montoContado = abierta ? this.asNumber(abierta.monto_apertura) : 0;
this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información de caja.');
        this.loading.set(false);
      }
    });
  }
loadResumen(idCaja: number): void {
  this.pos.getCajaResumen(idCaja).subscribe({
    next: (resumen) => {
      this.resumen.set(resumen);
      this.montoContado = this.asNumber(resumen.montoEsperado);
    },
    error: () => {
      this.error.set('No se pudo cargar el resumen de caja.');
    }
  });
}
  openNewCaja(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.error.set('Sesión no válida.');
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.openCaja({ idUsuario: user.idUsuario, montoApertura: this.montoApertura }).subscribe({
      next: () => {
        this.success.set('Caja abierta correctamente.');
        this.busy.set(false);
        this.loadCajas();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo abrir la caja.');
        this.busy.set(false);
      }
    });
  }
  metodoEntries(values: Record<string, number>): Array<{ name: string; total: number }> {
  return Object.entries(values ?? {}).map(([name, total]) => ({
    name,
    total: this.asNumber(total)
  }));
}
  closeCurrentCaja(): void {
    const caja = this.openCaja();
    if (!caja) {
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.success.set('');

    this.pos.closeCaja(caja.id_caja, {
      montoContado: this.montoContado,
      observaciones: this.observaciones
    }).subscribe({
      next: () => {
        this.success.set('Caja cerrada correctamente.');
        this.observaciones = '';
        this.busy.set(false);
        this.loadCajas();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo cerrar la caja.');
        this.busy.set(false);
      }
    });
  }

  asNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0);
  }
}