import { Component } from "@angular/core";
import { UsersComponent } from "./users/users.component";

@Component({
	selector: "app-main",
	imports: [UsersComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
