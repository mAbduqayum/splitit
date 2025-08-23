import { Component } from "@angular/core";
import { ItemsComponent } from "./items/items.component";
import { ItemsListComponent } from "./items-list/items-list.component";
import { UsersComponent } from "./users/users.component";
import { UsersListComponent } from "./users-list/users-list.component";

@Component({
	selector: "app-main",
	imports: [
		UsersComponent,
		UsersListComponent,
		ItemsComponent,
		ItemsListComponent,
	],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
