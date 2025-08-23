import { computed, effect, Injectable, signal } from "@angular/core";

export interface User {
	id: number;
	name: string;
}

@Injectable({
	providedIn: "root",
})
export class UsersService {
	private usersSet = signal<Set<User>>(new Set());

	// Computed signal to provide array interface for templates
	users = computed(() => Array.from(this.usersSet()));

	constructor() {
		this.#loadFromStorage();
		effect(() => {
			this.#syncUsers(this.usersSet());
		});
	}

	addUser(user: User): boolean {
		let wasAdded = false;
		this.usersSet.update((users) => {
			// Check if name already exists
			for (const existingUser of users) {
				if (existingUser.name.toLowerCase() === user.name.toLowerCase()) {
					console.warn(`User with name "${user.name}" already exists`);
					wasAdded = false;
					return users; // Don't add duplicate
				}
			}
			wasAdded = true;
			return new Set([...users, user]);
		});
		return wasAdded;
	}

	removeUser(userId: number) {
		this.usersSet.update((users) => {
			const newSet = new Set(users);
			for (const user of newSet) {
				if (user.id === userId) {
					newSet.delete(user);
					break;
				}
			}
			return newSet;
		});
	}

	updateUser(userId: number, newName: string) {
		this.usersSet.update((users) => {
			newName = newName.trim();

			// Check if new name conflicts with existing users (excluding current user)
			for (const existingUser of users) {
				if (
					existingUser.id !== userId &&
					existingUser.name.toLowerCase() === newName.toLowerCase()
				) {
					console.warn(`User with name "${newName}" already exists`);
					return users; // Don't update if name conflicts
				}
			}

			const newSet = new Set<User>();
			for (const user of users) {
				if (user.id === userId) {
					newSet.add({ ...user, name: newName });
				} else {
					newSet.add(user);
				}
			}
			return newSet;
		});
	}

	#syncUsers(users: Set<User>) {
		localStorage.setItem("users", JSON.stringify(Array.from(users)));
	}

	#loadFromStorage() {
		try {
			const stored = localStorage.getItem("users");
			if (stored) {
				const usersArray: User[] = JSON.parse(stored);
				this.usersSet.set(new Set(usersArray));
			}
		} catch (error) {
			console.error("Failed to load users:", error);
		}
	}
}
