import { Component } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

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
		id: new FormControl(""),
		price: new FormControl(0),
	});
	constructor(public dialogRef: MatDialogRef<CreateItemDialogComponent>) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
