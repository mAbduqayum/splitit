import { Component } from "@angular/core";
import { CreateItemComponent } from "./create-item/create-item.component";
import { CreateUserComponent } from "./create-user/create-user.component";

@Component({
	selector: "app-create-buttons",
	imports: [CreateItemComponent, CreateUserComponent],
	templateUrl: "./create-buttons.component.html",
	styleUrl: "./create-buttons.component.css",
	standalone: true,
})
export class CreateButtonsComponent {}
