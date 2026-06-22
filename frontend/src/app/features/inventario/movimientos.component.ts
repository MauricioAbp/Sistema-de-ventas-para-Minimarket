import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovimientoInventario } from '../../core/models/pos.models';
import { PosService } from '../../core/services/pos.service';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Inventario</p>
          <h1>Movimientos de stock</h1>
          <p class="subtitle">Historial de entradas, salidas y ajustes. Este módulo es solo lectura.</p>
        </div>

        <button type="button" class="btn-secondary" (click)="loadMovimientos()" [disabled]="loading()">
          Actualizar
        </button>
      </header>

      @if (error()) {
        <p class="banner error">{{ error() }}</p>
      }

      <section class="filters">
        <label>
          Producto
          <input
            placeholder="Nombre o código"
            [ngModel]="productFilter()"
            (ngModelChange)="productFilter.set($event)"
          >
        </label>

        <label>
          Tipo de movimiento
          <select [ngModel]="typeFilter()" (ngModelChange)="typeFilter.set($event)">
            <option value="">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
        </label>

        <label>
          Desde
          <input type="date" [ngModel]="fromDate()" (ngModelChange)="fromDate.set($event)">
        </label>

        <label>
          Hasta
          <input type="date" [ngModel]="toDate()" (ngModelChange)="toDate.set($event)">
        </label>
      </section>

      <section class="panel">
        @if (loading()) {
          <div class="state-box">Cargando movimientos...</div>
        } @else if (!filteredMovimientos().length) {
          <div class="state-box">No hay movimientos que coincidan con los filtros.</div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID Movimiento</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Stock anterior</th>
                  <th>Stock nuevo</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                @for (mov of filteredMovimientos(); track mov.id_movimiento) {
                  <tr>
                    <td>#{{ mov.id_movimiento }}</td>
                    <td>
                      <strong>{{ mov.producto?.nombre_producto || 'Producto no disponible' }}</strong>
                      <span>{{ mov.producto?.codigo_producto || '-' }}</span>
                    </td>
                    <td>
                      <span class="badge" [class.out]="mov.tipo_movimiento === 'SALIDA'" [class.adjust]="mov.tipo_movimiento === 'AJUSTE'">
                        {{ mov.tipo_movimiento }}
                      </span>
                    </td>
                    <td>{{ mov.cantidad }}</td>
                    <td>{{ mov.stock_anterior }}</td>
                    <td>{{ mov.stock_posterior }}</td>
                    <td>{{ mov.fecha_movimiento | date: 'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ userLabel(mov) }}</td>
                    <td>{{ mov.motivo || '-' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
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

    .filters {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1fr;
      gap: 12px;
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
      min-width: 1050px;
      border-collapse: collapse;
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
      background: #dcfce7;
      color: #166534;
      padding: 4px 8px;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .badge.out {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge.adjust {
      background: #fef3c7;
      color: #92400e;
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

    .btn-secondary {
      background: #e0f2fe;
      color: #075985;
    }

    @media (max-width: 1000px) {
      .filters {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 680px) {
      .page-header,
      .filters {
        display: grid;
        grid-template-columns: 1fr;
      }

      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class MovimientosComponent implements OnInit {
  readonly movimientos = signal<MovimientoInventario[]>([]);
  readonly productFilter = signal('');
  readonly typeFilter = signal('');
  readonly fromDate = signal('');
  readonly toDate = signal('');
  readonly loading = signal(true);
  readonly error = signal('');

  readonly filteredMovimientos = computed(() => {
    const productTerm = this.productFilter().trim().toLowerCase();
    const type = this.typeFilter();
    const from = this.fromDate();
    const to = this.toDate();

    return this.movimientos().filter((mov) => {
      const productName = mov.producto?.nombre_producto?.toLowerCase() ?? '';
      const productCode = mov.producto?.codigo_producto?.toLowerCase() ?? '';
      const productMatches = !productTerm || productName.includes(productTerm) || productCode.includes(productTerm);

      const typeMatches = !type || mov.tipo_movimiento === type;

      const dateValue = mov.fecha_movimiento ? mov.fecha_movimiento.slice(0, 10) : '';
      const fromMatches = !from || dateValue >= from;
      const toMatches = !to || dateValue <= to;

      return productMatches && typeMatches && fromMatches && toMatches;
    });
  });

  constructor(private pos: PosService) {}

  ngOnInit(): void {
    this.loadMovimientos();
  }

  loadMovimientos(): void {
    this.loading.set(true);
    this.error.set('');

    this.pos.listMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos.set(movimientos ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial de movimientos.');
        this.loading.set(false);
      }
    });
  }

  userLabel(movimiento: MovimientoInventario): string {
    const user = movimiento.usuario;
    if (!user) {
      return '-';
    }

    const fullName = `${user.nombre ?? ''} ${user.apellido ?? ''}`.trim();
    return fullName || user.username || '-';
  }
}