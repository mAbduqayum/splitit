import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	output,
} from "@angular/core";
import { ButtonDirective } from "../../directives/button.directive";
import { UsersService } from "../../services/users.service";

@Component({
	selector: "app-users-list",
	imports: [ButtonDirective],
	templateUrl: "./users-list.component.html",
	styleUrl: "./users-list.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
	service = inject(UsersService);

	users = computed(() => this.service.users());
	removeUser = output<number>();

	onRemoveUser(userId: number) {
		this.removeUser.emit(userId);
	}
}
