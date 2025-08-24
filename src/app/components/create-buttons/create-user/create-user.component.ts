import { Component, HostListener, inject } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { CreateUserDialogComponent } from "../create-user-dialog/create-user-dialog.component";

@Component({
	selector: "app-create-user",
	imports: [MatIcon, MatDialogModule, MatTooltip],
	templateUrl: "./create-user.component.html",
	styleUrl: "./create-user.component.css",
	standalone: true,
})
export class CreateUserComponent {
	dialog = inject(MatDialog);

	@HostListener("document:keydown.alt.u", ["$event"])
	open($event: Event): void {
		$event.stopPropagation();
		if (this.dialog.openDialogs.length > 0) {
			return;
		}
		this.dialog.open(CreateUserDialogComponent);
	}
}
