import { inject, Injectable } from "@angular/core";
import { BaseStorage } from "./base-storage.class";
import { ToastService } from "../components/toast/toast.service";

export interface User {
	id: number;
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService extends BaseStorage<User> {
	constructor() {
		super("users", inject(ToastService));
	}
}
