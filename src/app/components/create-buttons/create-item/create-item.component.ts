import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
	selector: "app-create-item",
	imports: [MatIcon],
	templateUrl: "./create-item.component.html",
	styleUrl: "./create-item.component.css",
})
export class CreateItemComponent {
	onClick(): void {
		console.log("click");
	}
}
