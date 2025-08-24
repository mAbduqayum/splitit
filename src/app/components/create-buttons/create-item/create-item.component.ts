import { Component, HostListener, inject } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { CreateItemDialogComponent } from "../create-item-dialog/create-item-dialog.component";

@Component({
	selector: "app-create-item",
	imports: [MatIcon, MatDialogModule, MatTooltip],
	templateUrl: "./create-item.component.html",
	styleUrl: "./create-item.component.css",
	standalone: true,
})
export class CreateItemComponent {
	dialog = inject(MatDialog);

	@HostListener("document:keydown.alt.i", ["$event"])
	open($event: Event): void {
		$event.stopPropagation();
		if (this.dialog.openDialogs.length > 0) {
			return;
		}
		this.dialog.open(CreateItemDialogComponent);
	}
}
