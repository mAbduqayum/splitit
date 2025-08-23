import { effect, Injectable, signal } from "@angular/core";

export interface User {
	id: number;
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService {
	users = signal<User[]>([]);

	constructor() {
		this.#loadFromStorage();
		effect(() => {
			this.#syncUsers(this.users());
		});
	}

	addUser(user: User) {
		this.users.update((users) => [...users, user]);
	}

	removeUser(userId: number) {
		this.users.update((users) => {
			return users.filter((user) => user.id !== userId);
		});
	}

	updateUser(userId: number, newName: string) {
		this.users.update((users) => {
			newName = newName.trim();
			return users.map((user) =>
				user.id === userId ? { ...user, name: newName } : user,
			);
		});
	}

	#syncUsers(users: User[]) {
		localStorage.setItem("users", JSON.stringify(users));
	}

	#loadFromStorage() {
		try {
			const stored = localStorage.getItem("users");
			if (stored) {
				this.users.set(JSON.parse(stored));
			}
		} catch (error) {
			console.error("Failed to load users:", error);
		}
	}
}
