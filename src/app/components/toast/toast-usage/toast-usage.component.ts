import { Component, inject } from "@angular/core";
import { ToastService } from "../toast.service";

@Component({
	selector: "app-toast-usage",
	imports: [],
	templateUrl: "./toast-usage.component.html",
	styleUrl: "./toast-usage.component.css",
})
export class ToastUsageComponent {
	#toastService = inject(ToastService);

	showSuccessToast() {
		this.#toastService.add({
			message: "Operation completed successfully!",
			type: "success",
		});
	}

	showErrorToast() {
		this.#toastService.add({
			message: "Something went wrong. Please try again.",
			type: "error",
		});
	}

	showInfoToast() {
		this.#toastService.add({
			message: "This is an informational message.",
			type: "info",
		});
	}

	showWarningToast() {
		this.#toastService.add({
			message: "Warning: Please check your input before proceeding.",
			type: "warning",
		});
	}
}
