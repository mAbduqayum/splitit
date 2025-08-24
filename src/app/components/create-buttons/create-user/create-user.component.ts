import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
	selector: "app-create-user",
	imports: [MatIcon],
	templateUrl: "./create-user.component.html",
	styleUrl: "./create-user.component.css",
})
export class CreateUserComponent {
	onClick(): void {
		console.log("click");
	}
}
