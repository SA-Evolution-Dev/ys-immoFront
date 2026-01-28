// src/app/shared/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);

    show(message: string, type: Toast['type'] = 'info', duration = 3000) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, message, type, duration };

        this.toasts.update(toasts => [...toasts, toast]);

        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    remove(id: string) {
        this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }
}
