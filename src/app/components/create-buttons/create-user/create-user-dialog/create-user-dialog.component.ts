import { Component } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
	selector: "app-create-user-dialog",
	templateUrl: "./create-user-dialog.component.html",
	styleUrls: ["./create-user-dialog.component.css"],
	standalone: true,
	imports: [
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
	],
})
export class CreateUserDialogComponent {
	form = new FormGroup({
		id: new FormControl(""),
	});
	constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>) {}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
