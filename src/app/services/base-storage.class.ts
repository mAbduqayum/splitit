import { effect, signal } from "@angular/core";

export class BaseStorage<T extends { id: number }> {
	readonly self = signal<Array<T>>([]);

	protected constructor(protected readonly storageKey: string) {
		this.storageKey = storageKey;
		console.log(this.storageKey);
		this.#sync();
	}

	#sync(): void {
		const stored = localStorage.getItem(this.storageKey);
		if (stored !== null) {
			this.self.set(JSON.parse(stored));
		}
		effect(() => {
			localStorage.setItem(this.storageKey, JSON.stringify(this.self()));
		});
	}

	add(itemData: Omit<T, "id">): void {
		const newItem = {
			id: Date.now(),
			...itemData,
		} as T;

		this.self.update((items) => {
			return [...items, newItem];
		});
	}

	update(item: T): void {
		this.self.update((items) => {
			const filtered = [...items].filter((i) => i.id !== item.id);
			return [...filtered, item];
		});
	}

	remove(item: T): void {
		this.self.update((users) => {
			return [...users].filter((u) => u.id !== item.id);
		});
	}

	clear(): void {
		this.self.set([]);
	}
}
