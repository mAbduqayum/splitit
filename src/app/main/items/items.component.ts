import { afterNextRender, Component, Injector, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { ItemsService } from "../../services/items.service";

@Component({
	selector: "app-items",
	imports: [ReactiveFormsModule, ButtonDirective],
	templateUrl: "./items.component.html",
	styleUrl: "./items.component.css",
})
export class ItemsComponent {
	private service = inject(ItemsService);
	private injector = inject(Injector);

	form = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(1)]),
		quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
		price: new FormControl(0, [Validators.required, Validators.min(0)]),
	});

	onSubmit() {
		if (this.form.valid) {
			const { name, quantity, price } = this.form.value;
			this.service.addItem(name!, quantity!, price!);
			this.form.reset({ name: "", quantity: 1, price: 0 });

			afterNextRender(
				() => {
					const input = document.querySelector("#itemName") as HTMLInputElement;
					if (input) {
						input.focus();
					}
				},
				{ injector: this.injector },
			);
		}
	}

	get nameControl() {
		return this.form.controls.name;
	}

	get quantityControl() {
		return this.form.controls.quantity;
	}

	get priceControl() {
		return this.form.controls.price;
	}
}
