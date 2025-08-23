import { effect, Injectable, signal } from "@angular/core";
import { BaseStorageService } from "./baseStorageService";

export interface User {
	id: number;
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService extends BaseStorageService<User> {
	readonly STORAGE_KEY = "users";
	readonly users = signal<Set<User>>(this.load());

	constructor() {
		super();
		effect(() => {
			this.save(this.users());
		});
	}

	load(): Set<User> {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (stored === null) {
			return new Set();
		}
		return new Set(JSON.parse(stored));
	}

	save(users: Set<User>): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
	}

	add(name: string): void {
		const newUser = {
			id: Date.now(),
			name,
		};
		this.users.update((users) => {
			return new Set([...users, newUser]);
		});
	}

	update(user: User): void {
		this.users.update((users) => {
			const filtered = [...users].filter((u) => u.id !== user.id);
			return new Set([...filtered, user]);
		});
	}

	remove(user: User): void {
		this.users.update((users) => {
			return new Set([...users].filter((u) => u.id !== user.id));
		});
	}
}
