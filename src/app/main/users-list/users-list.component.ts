import {
	afterNextRender,
	Component,
	computed,
	Injector,
	inject,
	signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { UsersService } from "../../services/users.service";

@Component({
	selector: "app-users-list",
	imports: [ButtonDirective, FormsModule],
	templateUrl: "./users-list.component.html",
	styleUrl: "./users-list.component.css",
})
export class UsersListComponent {
	service = inject(UsersService);
	injector = inject(Injector);

	users = computed(() => this.service.users());
	editingUserId = signal<number | null>(null);
	editingUserName = signal<string>("");

	onRemoveUser(userId: number) {
		this.service.removeUser(userId);
	}

	startEdit(userId: number, currentName: string) {
		this.editingUserId.set(userId);
		this.editingUserName.set(currentName);

		afterNextRender(
			() => {
				const input = document.querySelector(".edit-input") as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEdit() {
		this.editingUserId.set(null);
		this.editingUserName.set("");
	}

	updateUser(userId: number) {
		const newName = this.editingUserName().trim();
		if (newName) {
			this.service.updateUser(userId, newName);
		}
	}
}
