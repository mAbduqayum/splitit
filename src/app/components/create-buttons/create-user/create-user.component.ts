import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CreateUserDialogComponent } from "./create-user-dialog/create-user-dialog.component";
import { UsersService } from "../../../services/users.service";

@Component({
	selector: "app-create-user",
	imports: [MatIcon, MatDialogModule],
	templateUrl: "./create-user.component.html",
	styleUrl: "./create-user.component.css",
	standalone: true,
})
export class CreateUserComponent {
	dialog = inject(MatDialog);
	usersService = inject(UsersService);
	onClick(): void {
		this.dialog
			.open(CreateUserDialogComponent)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.usersService.add(result);
				}
			});
	}
}
