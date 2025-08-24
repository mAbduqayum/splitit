import { Injectable, signal } from "@angular/core";
import { newToast, Toast, ToastType } from "./toast.model";

@Injectable({
	providedIn: "root",
})
export class ToastService {
	toasts = signal<Toast[]>([]);

	add(message: string, type: ToastType) {
		const toast = newToast(message, type);
		this.toasts.update((toasts) => [...toasts, toast]);
		setTimeout(() => this.remove(toast.id), 3000);
	}

	remove(id: number) {
		this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
	}
}
