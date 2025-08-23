import { effect, Injectable, signal } from "@angular/core";

export interface Item {
	id: number;
	name: string;
	quantity: number;
	price: number;
}

@Injectable({
	providedIn: "root",
})
export class ItemsService {
	private readonly STORAGE_KEY = "items";
	private readonly items = signal<Item[]>(this.loadItems());

	constructor() {
		effect(() => {
			this.saveItems(this.items());
		});
	}

	private loadItems(): Item[] {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	}

	private saveItems(items: Item[]): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
	}

	getItems() {
		return this.items.asReadonly();
	}

	addItem(name: string, quantity: number, price: number): void {
		const newItem: Item = {
			id: Date.now(),
			name: name.trim(),
			quantity,
			price,
		};
		this.items.update((items) => [...items, newItem]);
	}

	removeItem(itemId: number): void {
		this.items.update((items) => items.filter((item) => item.id !== itemId));
	}

	updateItem(itemId: number, updates: Partial<Omit<Item, "id">>): void {
		this.items.update((items) =>
			items.map((item) =>
				item.id === itemId ? { ...item, ...updates } : item,
			),
		);
	}
}
