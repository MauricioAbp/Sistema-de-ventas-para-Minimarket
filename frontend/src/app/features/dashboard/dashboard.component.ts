import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardResponse } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

interface KpiCard {
  label: string;
  value: string;
  hint: string;
  tone: 'blue' | 'green' | 'amber' | 'red';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <section class="dashboard-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Resumen general</p>
          <h1>Dashboard</h1>
          <p class="subtitle">Indicadores principales del minimarket para el día de hoy.</p>
        </div>

        <button type="button" class="btn-secondary" (click)="loadDashboard()" [disabled]="loading()">
          Actualizar
        </button>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      @if (loading()) {
        <div class="state-box">Cargando resumen...</div>
      } @else {
        <div class="kpi-grid">
          @for (card of kpis(); track card.label) {
            <article class="kpi-card" [class]="card.tone">
              <span>{{ card.label }}</span>
              <strong>{{ card.value }}</strong>
              <small>{{ card.hint }}</small>
            </article>
          }
        </div>

        <div class="dashboard-grid">
          <section class="panel chart-panel">
            <div class="panel-header">
              <h2>Ventas por día</h2>
              <span>Últimos 7 días</span>
            </div>

            @if (!ventasPorDia().length) {
              <div class="empty-panel">Sin ventas recientes.</div>
            } @else {
              <div class="bar-chart" aria-label="Gráfico de ventas por día">
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
              <h2>Productos más vendidos</h2>
              <span>Últimos 7 días</span>
            </div>

            @if (!productosMasVendidos().length) {
              <div class="empty-panel">Sin productos vendidos.</div>
            } @else {
              <ul class="ranking-list">
                @for (product of productosMasVendidos(); track product.label) {
                  <li>
                    <div>
                      <strong>{{ product.label }}</strong>
                      <span>{{ product.value | number: '1.0-0' }} unidades</span>
                    </div>
                  </li>
                }
              </ul>
            }
          </section>

          <section class="panel">
            <div class="panel-header">
              <h2>Métodos de pago</h2>
              <span>Últimos 7 días</span>
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
              <h2>Accesos rápidos</h2>
              <span>Operaciones frecuentes</span>
            </div>

            <div class="quick-actions">
              <a routerLink="/app/ventas/pos">
                <strong>Nueva venta</strong>
                <span>Abrir punto de venta</span>
              </a>
              <a routerLink="/app/caja">
                <strong>Caja</strong>
                <span>Gestionar turno actual</span>
              </a>
              <a routerLink="/app/productos">
                <strong>Productos</strong>
                <span>Revisar inventario</span>
              </a>
              <a routerLink="/app/reportes">
                <strong>Reportes</strong>
                <span>Analizar rendimiento</span>
              </a>
            </div>
          </section>
        </div>
      }
    </section>
  `,
  styles: [`
    .dashboard-page {
      display: grid;
      gap: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
    }

    .eyebrow {
      margin: 0 0 4px;
      color: #2563eb;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 0.75rem;
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

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .kpi-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      display: grid;
      gap: 8px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
    }

    .kpi-card span {
      color: #64748b;
      font-weight: 700;
      font-size: 0.88rem;
    }

    .kpi-card strong {
      color: #0f172a;
      font-size: 1.65rem;
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

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 14px;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
      min-width: 0;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .panel-header h2 {
      margin: 0;
      font-size: 1rem;
      color: #0f172a;
    }

    .panel-header span {
      color: #64748b;
      font-size: 0.85rem;
    }

    .bar-chart {
      height: 240px;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
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
      display: block;
      width: 100%;
      background: #2563eb;
      border-radius: 8px 8px 0 0;
      min-height: 6px;
    }

    .bar-item small {
      color: #64748b;
      font-weight: 700;
    }

    .ranking-list,
    .payment-list,
    .quick-actions {
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .ranking-list li {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 10px;
    }

    .ranking-list strong,
    .quick-actions strong {
      display: block;
      color: #0f172a;
    }

    .ranking-list span,
    .quick-actions span {
      color: #64748b;
      font-size: 0.9rem;
    }

    .payment-list div {
      display: grid;
      gap: 6px;
    }

    .payment-list div > span {
      color: #334155;
      font-weight: 700;
    }

    .payment-list strong {
      color: #0f172a;
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

    .quick-actions a {
      display: block;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      text-decoration: none;
      background: #f8fafc;
    }

    .quick-actions a:hover {
      border-color: #2563eb;
      background: #eff6ff;
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

    .empty-panel {
      min-height: 180px;
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

    .btn-secondary {
      background: #e0f2fe;
      color: #075985;
    }

    @media (max-width: 1100px) {
      .kpi-grid,
      .dashboard-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .chart-panel {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 700px) {
      .page-header,
      .kpi-grid,
      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
      }

      .bar-chart {
        height: 200px;
      }

      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly dashboard = signal<DashboardResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly kpis = computed<KpiCard[]>(() => {
    const data = this.dashboard();

    return [
      {
        label: 'Ventas totales',
        value: String(data?.ventasTotales ?? 0),
        hint: 'Transacciones registradas hoy',
        tone: 'blue'
      },
      {
        label: 'Ingresos del día',
        value: `S/ ${this.formatMoney(data?.ingresosDia ?? 0)}`,
        hint: 'Suma de ventas de hoy',
        tone: 'green'
      },
      {
        label: 'Stock bajo',
        value: String(data?.productosStockBajo ?? 0),
        hint: 'Productos requieren reposición',
        tone: 'amber'
      },
      {
        label: 'Productos activos',
        value: String(data?.totalProductos ?? 0),
        hint: 'Productos disponibles en catálogo',
        tone: 'red'
      }
    ];
  });

  readonly ventasPorDia = computed(() => this.withPercent(this.dashboard()?.ventasPorDia ?? []));
  readonly metodosPago = computed(() => this.withPercent(this.dashboard()?.metodosPago ?? []));
  readonly productosMasVendidos = computed(() => this.dashboard()?.productosMasVendidos ?? []);

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.pos.getDashboardResumen().subscribe({
      next: (dashboard) => {
        this.dashboard.set(dashboard);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el resumen del dashboard.');
        this.loading.set(false);
      }
    });
  }

  withPercent(items: { label: string; value: number }[]): Array<{ label: string; value: number; percent: number }> {
    const max = Math.max(...items.map((item) => Number(item.value)), 0);

    if (!max) {
      return items.map((item) => ({ ...item, percent: 0 }));
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

  formatMoney(value: number): string {
    return Number(value ?? 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}