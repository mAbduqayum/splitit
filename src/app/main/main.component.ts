import { Component, inject } from "@angular/core";
import { ToastComponent } from "../components/toast/toast.component";
import { UsersService } from "../services/users.service";
import { ItemsService } from "../services/items.service";

@Component({
	selector: "app-main",
	imports: [ToastComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {
	usersService = inject(UsersService);
	itemsService = inject(ItemsService);
}
