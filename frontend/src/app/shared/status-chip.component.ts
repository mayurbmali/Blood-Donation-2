import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ll-chip" [ngClass]="getChipClass()">
      <span class="ll-chip__dot"></span>
      {{ getLabel() }}
    </span>
  `,
  styles: [`
    .ll-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.35px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .ll-chip__dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
    .chip-pending { background: #FEF3C7; color: #D97706; }
    .chip-approved, .chip-ok { background: #D1FAE5; color: #059669; }
    .chip-rejected, .chip-critical { background: #FEE2E2; color: #DC2626; }
    .chip-low { background: #FEF3C7; color: #D97706; }
  `]
})
export class StatusChipComponent {
  @Input() status: string = '';

  getChipClass(): string {
    const s = this.status ? this.status.toUpperCase() : '';
    if (s === 'PENDING' || s === 'LOW') return 'chip-pending';
    if (s === 'APPROVED' || s === 'OK') return 'chip-approved';
    if (s === 'REJECTED' || s === 'CRITICAL') return 'chip-rejected';
    return '';
  }

  getLabel(): string {
    return this.status || '';
  }
}
