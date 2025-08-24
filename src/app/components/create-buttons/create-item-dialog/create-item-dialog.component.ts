import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ItemsService } from "../../../services/items.service";

@Component({
	selector: "app-create-item-dialog",
	templateUrl: "./create-item-dialog.component.html",
	styleUrls: ["./create-item-dialog.component.css"],
	standalone: true,
	imports: [
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
	],
})
export class CreateItemDialogComponent {
	form = new FormGroup({
		id: new FormControl("", { nonNullable: true }),
		price: new FormControl(0, { nonNullable: true }),
	});
	#itemsService = inject(ItemsService);

	constructor(public dialogRef: MatDialogRef<CreateItemDialogComponent>) {}

	add(): void {
		if (this.form.invalid) {
			return;
		}
		this.#itemsService.add(this.form.getRawValue());
		this.form.reset();
	}
}
