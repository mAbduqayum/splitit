import { Component, inject } from "@angular/core";
import {
	FormBuilder,
	FormControl,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { User, UsersService } from "../../services/users.service";
@Component({
	selector: "app-users",
	imports: [ReactiveFormsModule, ButtonDirective],
	templateUrl: "./users.component.html",
	styleUrl: "./users.component.css",
})
export class UsersComponent {
	service = inject(UsersService);
	#fb = inject(FormBuilder);

	form = this.#fb.group({
		name: new FormControl("", [Validators.required]),
	});

	addUser() {
		if (!this.form.valid || !this.form.value.name) {
			return;
		}
		const name = this.form.value.name;
		const newUser: User = {
			id: Date.now(),
			name: name.trim(),
		};
		this.service.addUser(newUser);
		this.form.reset();
	}
}
