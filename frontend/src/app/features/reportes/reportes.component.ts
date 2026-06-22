import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReporteResumenResponse } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

interface Kpi {
  label: string;
  value: string;
  hint: string;
  tone: 'blue' | 'green' | 'amber' | 'red';
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Analítica</p>
          <h1>Reportes</h1>
          <p class="subtitle">Consulta ventas, costos, ganancias y métodos de pago por período.</p>
        </div>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      <section class="filters">
        <label>
          Período
          <select [ngModel]="period()" (ngModelChange)="setPeriod($event)">
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="custom">Personalizado</option>
          </select>
        </label>

        <label>
          Desde
          <input type="date" [ngModel]="desde()" (ngModelChange)="desde.set($event)">
        </label>

        <label>
          Hasta
          <input type="date" [ngModel]="hasta()" (ngModelChange)="hasta.set($event)">
        </label>

        <button type="button" class="btn-primary" (click)="loadReporte()" [disabled]="loading() || !desde() || !hasta()">
          {{ loading() ? 'Cargando...' : 'Aplicar filtros' }}
        </button>
      </section>

      @if (loading()) {
        <div class="state-box">Cargando reporte...</div>
      } @else if (reporte(); as data) {
        <div class="kpi-grid">
          @for (item of kpis(); track item.label) {
            <article class="kpi-card" [class]="item.tone">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <small>{{ item.hint }}</small>
            </article>
          }
        </div>

        <div class="grid">
          <section class="panel chart-panel">
            <div class="panel-header">
              <h2>Evolución de ventas</h2>
              <span>{{ desde() }} a {{ hasta() }}</span>
            </div>

            @if (!ventasPorDia().length) {
              <div class="empty-panel">Sin ventas en el período.</div>
            } @else {
              <div class="bar-chart">
                @for (bar of ventasPorDia(); track bar.label) {
                  <div class="bar-item">
                    <div class="bar-track">
                      <span [style.height.%]="bar.percent"></span>
                    </div>
                    <small>{{ shortDate(bar.label) }}</small>
                  </div>
                }
              </div>
            }
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Tendencia de ganancias</h2>
              <span>Ganancia neta por día</span>
            </div>

            @if (!gananciasPorDia().length) {
              <div class="empty-panel">Sin ganancias registradas.</div>
            } @else {
              <ul class="list">
                @for (item of gananciasPorDia(); track item.label) {
                  <li>
                    <span>{{ item.label }}</span>
                    <strong>S/ {{ item.value | number: '1.2-2' }}</strong>
                  </li>
                }
              </ul>
            }
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Métodos de pago</h2>
              <span>Distribución</span>
            </div>

            @if (!metodosPago().length) {
              <div class="empty-panel">Sin pagos registrados.</div>
            } @else {
              <div class="payment-list">
                @for (method of metodosPago(); track method.label) {
                  <div>
                    <span>{{ method.label || 'No especificado' }}</span>
                    <strong>S/ {{ method.value | number: '1.2-2' }}</strong>
                    <progress max="100" [value]="method.percent"></progress>
                  </div>
                }
              </div>
            }
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Exportación</h2>
              <span>Próximamente</span>
            </div>

            <div class="export-actions">
              <button type="button" class="btn-secondary" disabled>Exportar PDF</button>
<button type="button" class="btn-secondary" (click)="exportCsv()" [disabled]="!reporte()">
  Exportar Excel
</button>
            </div>
          </section>
        </div>
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
      font-size: 1rem;
    }

    .subtitle {
      margin: 6px 0 0;
      color: #64748b;
    }

    .filters {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 12px;
      align-items: end;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
    }

    label {
      display: grid;
      gap: 6px;
      color: #334155;
      font-weight: 700;
    }

    input,
    select {
      height: 42px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0 12px;
      font: inherit;
      min-width: 0;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .kpi-card,
    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .kpi-card {
      padding: 16px;
      display: grid;
      gap: 8px;
    }

    .kpi-card span {
      color: #64748b;
      font-weight: 700;
      font-size: 0.88rem;
    }

    .kpi-card strong {
      color: #0f172a;
      font-size: 1.55rem;
    }

    .kpi-card small {
      color: #64748b;
    }

    .kpi-card.blue {
      border-top: 4px solid #2563eb;
    }

    .kpi-card.green {
      border-top: 4px solid #10b981;
    }

    .kpi-card.amber {
      border-top: 4px solid #f59e0b;
    }

    .kpi-card.red {
      border-top: 4px solid #ef4444;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 14px;
    }

    .panel {
      padding: 16px;
      display: grid;
      gap: 14px;
      min-width: 0;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }

    .panel-header span {
      color: #64748b;
      font-size: 0.85rem;
    }

    .chart-panel {
      grid-row: span 2;
    }

    .bar-chart {
      height: 300px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(42px, 1fr));
      gap: 12px;
      align-items: end;
    }

    .bar-item {
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      gap: 8px;
      text-align: center;
    }

    .bar-track {
      background: #eef2ff;
      border-radius: 8px;
      display: flex;
      align-items: end;
      overflow: hidden;
    }

    .bar-track span {
      width: 100%;
      background: #2563eb;
      border-radius: 8px 8px 0 0;
      min-height: 6px;
    }

    .bar-item small {
      color: #64748b;
      font-weight: 700;
    }

    .list {
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .list li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }

    .list span {
      color: #64748b;
      font-weight: 700;
    }

    .list strong {
      color: #0f172a;
    }

    .payment-list {
      display: grid;
      gap: 12px;
    }

    .payment-list div {
      display: grid;
      gap: 6px;
    }

    .payment-list span {
      color: #334155;
      font-weight: 700;
    }

    progress {
      width: 100%;
      height: 8px;
      border: 0;
      border-radius: 999px;
      overflow: hidden;
    }

    progress::-webkit-progress-bar {
      background: #e2e8f0;
    }

    progress::-webkit-progress-value {
      background: #10b981;
    }

    .export-actions {
      display: grid;
      gap: 10px;
    }

    .banner,
    .state-box,
    .empty-panel {
      border-radius: 8px;
      padding: 14px 16px;
    }

    .banner.error {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .state-box,
    .empty-panel {
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

    @media (max-width: 1100px) {
      .filters,
      .kpi-grid,
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .chart-panel {
        grid-row: auto;
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 700px) {
      .filters,
      .kpi-grid,
      .grid,
      .page-header {
        grid-template-columns: 1fr;
        display: grid;
      }

      .btn-primary {
        width: 100%;
      }

      .bar-chart {
        height: 220px;
      }
    }
  `]
})
export class ReportesComponent implements OnInit {
  readonly reporte = signal<ReporteResumenResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly period = signal<'day' | 'week' | 'month' | 'custom'>('month');
  readonly desde = signal('');
  readonly hasta = signal('');

  readonly kpis = computed<Kpi[]>(() => {
    const data = this.reporte();

    return [
      {
        label: 'Ventas totales',
        value: `S/ ${this.formatMoney(data?.ingresosTotales ?? 0)}`,
        hint: 'Ingresos del período',
        tone: 'blue'
      },
      {
        label: 'Costos totales',
        value: `S/ ${this.formatMoney(data?.costosTotales ?? 0)}`,
        hint: 'Costo estimado de productos vendidos',
        tone: 'amber'
      },
      {
        label: 'Ganancia neta',
        value: `S/ ${this.formatMoney(data?.gananciaNeta ?? 0)}`,
        hint: 'Ingresos menos costos',
        tone: 'green'
      },
      {
        label: 'Transacciones',
        value: String(data?.numeroTransacciones ?? 0),
        hint: 'Ventas completadas',
        tone: 'red'
      }
    ];
  });

  readonly ventasPorDia = computed(() => this.withPercent(this.reporte()?.ventasPorDia ?? []));
  readonly gananciasPorDia = computed(() => this.reporte()?.gananciasPorDia ?? []);
  readonly metodosPago = computed(() => this.withPercent(this.reporte()?.metodosPago ?? []));

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.setPeriod('month');
  }

  setPeriod(value: 'day' | 'week' | 'month' | 'custom'): void {
    this.period.set(value);

    const today = new Date();
    const end = this.toInputDate(today);
    const startDate = new Date(today);

    if (value === 'day') {
      // today
    } else if (value === 'week') {
      startDate.setDate(today.getDate() - 6);
    } else if (value === 'month') {
      startDate.setDate(1);
    } else {
      return;
    }

    this.desde.set(this.toInputDate(startDate));
    this.hasta.set(end);
    this.loadReporte();
  }

  loadReporte(): void {
    if (!this.desde() || !this.hasta()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.pos.getReporteResumen(this.desde(), this.hasta()).subscribe({
      next: (reporte) => {
        this.reporte.set(reporte);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el reporte.');
        this.loading.set(false);
      }
    });
  }
  exportCsv(): void {
  const data = this.reporte();

  if (!data) {
    return;
  }

  const rows = [
    ['Reporte de ventas'],
    [`Desde`, this.desde()],
    [`Hasta`, this.hasta()],
    [],
    ['Indicador', 'Valor'],
    ['Ingresos totales', data.ingresosTotales],
    ['Costos totales', data.costosTotales],
    ['Ganancia neta', data.gananciaNeta],
    ['Numero de transacciones', data.numeroTransacciones],
    [],
    ['Ventas por dia'],
    ['Fecha', 'Total'],
    ...data.ventasPorDia.map((item) => [item.label, item.value]),
    [],
    ['Ganancias por dia'],
    ['Fecha', 'Ganancia'],
    ...data.gananciasPorDia.map((item) => [item.label, item.value]),
    [],
    ['Metodos de pago'],
    ['Metodo', 'Total'],
    ...data.metodosPago.map((item) => [item.label, item.value])
  ];

  const csv = rows
    .map((row) => row.map((cell) => this.csvCell(cell)).join(';'))
    .join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `reporte-${this.desde()}-${this.hasta()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

csvCell(value: unknown): string {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

  withPercent(items: { label: string; value: number }[]): Array<{ label: string; value: number; percent: number }> {
    const max = Math.max(...items.map((item) => Number(item.value)), 0);

    if (!max) {
      return items.map((item) => ({ ...item, value: Number(item.value), percent: 0 }));
    }

    return items.map((item) => ({
      ...item,
      value: Number(item.value),
      percent: Math.max(6, Math.round((Number(item.value) / max) * 100))
    }));
  }

  shortDate(value: string): string {
    if (!value) {
      return '-';
    }

    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }

    return value;
  }

  toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  formatMoney(value: number): string {
    return Number(value ?? 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}