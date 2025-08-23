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
}
