import { Component, inject } from "@angular/core";
import { UsersService } from "../services/users.service";
import { Item, ItemsService } from "../services/items.service";

@Component({
	selector: "app-users-items",
	imports: [],
	templateUrl: "./users-items.component.html",
	styleUrl: "./users-items.component.css",
})
export class UsersItemsComponent {
	usersService = inject(UsersService);
	itemsService = inject(ItemsService);

	constructor() {
		this.add("x");
		this.add("y");
	}
	add(name: string): void {
		this.itemsService.add({ name, price: 0 });
	}
}
