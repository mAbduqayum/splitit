import { Injectable, signal } from "@angular/core";
import { Toast } from "./toast.model";

@Injectable({
	providedIn: "root",
})
export class ToastService {
	toasts = signal<Toast[]>([]);

	add(toast: Toast) {
		const newToast = { ...toast, id: Date.now() };
		this.toasts.update((toasts) => [...toasts, newToast]);
		setTimeout(() => this.remove(newToast.id), 5000);
	}

	remove(id: number) {
		this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
	}
}
