import { effect, signal } from "@angular/core";

export class BaseStorage<T extends { id: number }> {
	readonly self = signal<Set<T>>(this.#load());

	protected constructor(protected readonly storage_key: string) {
		this.storage_key = storage_key;
		effect(() => {
			this.#save(this.self());
		});
	}

	#load(): Set<T> {
		const stored = localStorage.getItem(this.storage_key);
		if (stored === null) {
			return new Set();
		}
		return new Set(JSON.parse(stored));
	}

	#save(items: Set<T>): void {
		localStorage.setItem(this.storage_key, JSON.stringify(items));
	}

	add(itemData: Omit<T, "id">): void {
		const newItem = {
			id: Date.now(),
			...itemData,
		} as T;

		this.self.update((items) => {
			return new Set([...items, newItem]);
		});
	}

	update(item: T): void {
		this.self.update((items) => {
			const filtered = [...items].filter((i) => i.id !== item.id);
			return new Set([...filtered, item]);
		});
	}

	remove(item: T): void {
		this.self.update((users) => {
			return new Set([...users].filter((u) => u.id !== item.id));
		});
	}
}
