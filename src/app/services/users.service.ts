import { Injectable } from "@angular/core";
import { BaseStorage } from "./base-storage.class";

export interface User {
	id: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService extends BaseStorage<User> {
	constructor() {
		super("users");
	}
}
