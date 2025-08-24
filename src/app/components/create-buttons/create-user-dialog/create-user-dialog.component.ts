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
import { UsersService } from "../../../services/users.service";

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
		id: new FormControl("", { nonNullable: true }),
	});
	#usersService = inject(UsersService);

	constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>) {}

	add(): void {
		if (this.form.invalid) {
			return;
		}
		this.#usersService.add(this.form.getRawValue());
		this.form.reset();
	}
}
