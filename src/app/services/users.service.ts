import { Injectable, inject } from "@angular/core";
import { ToastService } from "../components/toast/toast.service";
import { BaseStorage } from "./base-storage.class";

export interface User {
	id: number;
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService extends BaseStorage<User> {
	constructor() {
		super("users");
	}
}
