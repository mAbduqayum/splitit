import { Component, computed, inject } from "@angular/core";
import { UsersService } from "../services/users.service";
import { ItemsService } from "../services/items.service";
import { MatButton } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";

@Component({
	selector: "summary",
	imports: [MatButton, MatTableModule],
	templateUrl: "./summary.component.html",
	styleUrl: "./summary.component.css",
})
export class SummaryComponent {
	usersService = inject(UsersService);
	itemsService = inject(ItemsService);
	summaries = ["subTotal", "tax", "tip", "total"];

	displayedColumns = computed(() => [
		"user-name",
		...this.itemsService.self().map((i) => i.name),
		...this.summaries,
	]);

	addItem(): void {
		this.itemsService.add({
			name: Date.now().toString(),
			price: Math.floor(Math.random() * 10),
		});
	}

	addUser(): void {
		this.usersService.add({ name: Date.now().toString() });
	}

	clearAll(): void {
		this.usersService.clear();
		this.itemsService.clear();
	}
}
