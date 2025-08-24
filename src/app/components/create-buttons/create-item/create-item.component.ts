import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CreateItemDialogComponent } from "./create-item-dialog/create-item-dialog.component";
import { ItemsService } from "../../../services/items.service";

@Component({
	selector: "app-create-item",
	imports: [MatIcon, MatDialogModule],
	templateUrl: "./create-item.component.html",
	styleUrl: "./create-item.component.css",
	standalone: true,
})
export class CreateItemComponent {
	dialog = inject(MatDialog);
	itemsService = inject(ItemsService);
	onClick(): void {
		this.dialog
			.open(CreateItemDialogComponent)
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.itemsService.add(result);
				}
			});
	}
}
