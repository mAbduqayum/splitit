import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { ToastService } from "./toast.service";

@Component({
	selector: "app-toast",
	imports: [MatIcon],
	templateUrl: "./toast.component.html",
	styleUrl: "./toast.component.css",
})
export class ToastComponent {
	#toastService = inject(ToastService);

	toasts = this.#toastService.toasts;

	onClose(id: number | undefined) {
		if (id) {
			this.#toastService.remove(id);
		}
	}
}
