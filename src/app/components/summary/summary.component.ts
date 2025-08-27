import { Component, computed, HostListener, inject } from "@angular/core";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatTooltip } from "@angular/material/tooltip";
import { Item, ItemsService } from "../../services/items.service";
import { User, UsersService } from "../../services/users.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { CreateButtonsComponent } from "../create-buttons/create-buttons.component";

@Component({
	selector: "app-summary",
	imports: [
		MatButton,
		MatTableModule,
		MatIconButton,
		MatIcon,
		CreateButtonsComponent,
		MatTooltip,
	],
	templateUrl: "./summary.component.html",
	styleUrl: "./summary.component.css",
	standalone: true,
})
export class SummaryComponent {
	usersService = inject(UsersService);
	itemsService = inject(ItemsService);
	dialog = inject(MatDialog);
	summaries = ["subTotal", "tax", "tip", "total"];

	displayedColumns = computed(() => [
		"user-name",
		...this.itemsService.store().map((i) => i.id),
		...this.summaries,
	]);

	addItem(): void {
		this.itemsService.add({
			id: Date.now().toString(),
			price: Math.floor(Math.random() * 10),
		});
	}

	removeItem(item: Item): void {
		this.itemsService.remove(item);
	}

	removeUser(user: User): void {
		this.usersService.remove(user);
	}

	addUser(): void {
		this.usersService.add({ id: Date.now().toString() });
	}

	@HostListener("document:keydown.alt.c", ["$event"])
	clearAll($event: Event): void {
		$event.stopPropagation();
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			data: {
				title: "Clear All Data",
				message: "Are you sure you want to clear all users and items?",
				confirmText: "Clear",
				cancelText: "Cancel",
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.usersService.clear();
				this.itemsService.clear();
			}
		});
	}
}
