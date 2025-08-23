import { computed, effect, Injectable, signal } from "@angular/core";

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
	private readonly itemsSet = signal<Set<Item>>(this.loadItems());

	// Computed signal to provide array interface and readonly access
	private items = computed(() => Array.from(this.itemsSet()));

	constructor() {
		effect(() => {
			this.saveItems(this.itemsSet());
		});
	}

	private loadItems(): Set<Item> {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		const itemsArray: Item[] = stored ? JSON.parse(stored) : [];
		return new Set(itemsArray);
	}

	private saveItems(items: Set<Item>): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(items)));
	}

	getItems() {
		return this.items;
	}

	addItem(name: string, quantity: number, price: number): boolean {
		const trimmedName = name.trim();
		const newItem: Item = {
			id: Date.now(),
			name: trimmedName,
			quantity,
			price,
		};

		let wasAdded = false;
		this.itemsSet.update((items) => {
			// Check if name already exists
			for (const existingItem of items) {
				if (existingItem.name.toLowerCase() === trimmedName.toLowerCase()) {
					console.warn(`Item with name "${trimmedName}" already exists`);
					wasAdded = false;
					return items; // Don't add duplicate
				}
			}
			wasAdded = true;
			return new Set([...items, newItem]);
		});
		return wasAdded;
	}

	removeItem(itemId: number): void {
		this.itemsSet.update((items) => {
			const newSet = new Set(items);
			for (const item of newSet) {
				if (item.id === itemId) {
					newSet.delete(item);
					break;
				}
			}
			return newSet;
		});
	}

	updateItem(itemId: number, updates: Partial<Omit<Item, "id">>): void {
		this.itemsSet.update((items) => {
			// If updating name, check for conflicts
			if (updates.name) {
				const trimmedName = updates.name.trim();
				for (const existingItem of items) {
					if (
						existingItem.id !== itemId &&
						existingItem.name.toLowerCase() === trimmedName.toLowerCase()
					) {
						console.warn(`Item with name "${trimmedName}" already exists`);
						return items; // Don't update if name conflicts
					}
				}
				updates.name = trimmedName;
			}

			const newSet = new Set<Item>();
			for (const item of items) {
				if (item.id === itemId) {
					newSet.add({ ...item, ...updates });
				} else {
					newSet.add(item);
				}
			}
			return newSet;
		});
	}
}
