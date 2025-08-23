import { effect, Injectable, signal } from "@angular/core";
import { BaseStorageService } from "./baseStorageService";

export interface Item {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

@Injectable({
	providedIn: "root",
})
export class ItemsService extends BaseStorageService<Item> {
	readonly STORAGE_KEY = "items";
	readonly items = signal<Set<Item>>(this.load());

	constructor() {
		super();
		effect(() => {
			this.save(this.items());
		});
	}

	load(): Set<Item> {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (stored === null) {
			return new Set();
		}
		return new Set(JSON.parse(stored));
	}

	save(items: Set<Item>): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
	}

	add(name: string, quantity: number, price: number): void {
		const newItem = {
			id: Date.now(),
			name,
			quantity,
			price,
		};
		this.items.update((items) => {
			return new Set([...items, newItem]);
		});
	}

	update(item: Item): void {
		this.items.update((items) => {
			const filtered = [...items].filter((i) => i.id !== item.id);
			return new Set([...filtered, item]);
		});
	}

	remove(item: Item): void {
		this.items.update((items) => {
			return new Set([...items].filter((i) => i.id !== item.id));
		});
	}
}
