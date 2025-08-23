import { Component } from "@angular/core";
import { ItemsComponent } from "./items/items.component";
import { ItemsListComponent } from "./items-list/items-list.component";
import { UserItemsTableComponent } from "./user-items-table/user-items-table.component";
import { UsersComponent } from "./users/users.component";
import { UsersListComponent } from "./users-list/users-list.component";

@Component({
	selector: "app-main",
	imports: [
		UsersComponent,
		UsersListComponent,
		ItemsComponent,
		ItemsListComponent,
		UserItemsTableComponent,
	],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
