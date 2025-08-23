import { Component } from "@angular/core";
import { UsersComponent } from "./users/users.component";
import { UsersListComponent } from "./users-list/users-list.component";

@Component({
	selector: "app-main",
	imports: [UsersComponent, UsersListComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
