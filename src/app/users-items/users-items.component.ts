import { Component, inject } from "@angular/core";
import { UsersService } from "../services/users.service";
import { ItemsService } from "../services/items.service";
import { MatButton } from "@angular/material/button";

@Component({
	selector: "app-users-items",
	imports: [MatButton],
	templateUrl: "./users-items.component.html",
	styleUrl: "./users-items.component.css",
})
export class UsersItemsComponent {
	usersService = inject(UsersService);
	itemsService = inject(ItemsService);

	addItem(): void {
		this.itemsService.add({ name: Date.now().toString(), price: 0 });
	}
	addUser(): void {
		this.usersService.add({ name: Date.now().toString() });
	}
	clearAll(): void {
		this.usersService.clear();
		this.itemsService.clear();
	}
}
