import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { ToastService } from "../toast.service";

@Component({
	selector: "app-toast-usage",
	imports: [MatButton],
	templateUrl: "./toast-usage.component.html",
	styleUrl: "./toast-usage.component.css",
})
export class ToastUsageComponent {
	#toastService = inject(ToastService);

	showSuccessToast() {
		this.#toastService.add("Operation completed successfully!", "success");
	}

	showErrorToast() {
		this.#toastService.add("Something went wrong. Please try again.", "error");
	}

	showInfoToast() {
		this.#toastService.add("This is an informational message.", "info");
	}

	showWarningToast() {
		this.#toastService.add(
			"Warning: Please check your input before proceeding.",
			"warning",
		);
	}
}
