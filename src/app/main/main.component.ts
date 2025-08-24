import { Component } from "@angular/core";
import { UsersItemsComponent } from "../users-items/users-items.component";

@Component({
	selector: "app-main",
	imports: [UsersItemsComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
