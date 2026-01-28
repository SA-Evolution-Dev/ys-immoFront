import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="toast toast-{{ toast.type }}"
          (click)="toastService.remove(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button 
            class="toast-close"
            (click)="toastService.remove(toast.id); $event.stopPropagation()"
            aria-label="Fermer">
            ✕
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      background: white;
      border-left: 4px solid;
      pointer-events: auto;
    }

    .toast-icon {
      font-size: 24px;
      font-weight: bold;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      color: #333;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .toast-success {
      border-left-color: #10b981;
    }

    .toast-success .toast-icon {
      color: #10b981;
    }

    .toast-error {
      border-left-color: #ef4444;
    }

    .toast-error .toast-icon {
      color: #ef4444;
    }

    .toast-warning {
      border-left-color: #f59e0b;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-info {
      border-left-color: #3b82f6;
    }

    .toast-info .toast-icon {
      color: #3b82f6;
    }

    @media (max-width: 640px) {
      .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
