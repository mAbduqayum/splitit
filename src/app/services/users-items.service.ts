import { computed, effect, Injectable, inject, signal } from "@angular/core";
import { ItemsService, Item } from "./items.service";
import { UsersService } from "./users.service";

export interface UserItemMapping {
	userId: number;
	itemId: number;
	quantity: number;
}

export interface BillItemEntry {
	item: Item;
	assignedQuantity: number;
	total: number;
}

export interface BillEntry {
	userId: number;
	userName: string;
	items: BillItemEntry[];
	totalBill: number;
}

@Injectable({
	providedIn: "root",
})
export class UsersItemsService {
	private readonly STORAGE_KEY = "users-items";
	private readonly userItemMappingsSet = signal<Set<UserItemMapping>>(
		this.loadMappings(),
	);

	// Computed signal to provide array interface
	private userItemMappings = computed(() =>
		Array.from(this.userItemMappingsSet()),
	);

	private usersService = inject(UsersService);
	private itemsService = inject(ItemsService);

	constructor() {
		effect(() => {
			this.saveMappings(this.userItemMappingsSet());
		});
	}

	private loadMappings(): Set<UserItemMapping> {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		const mappingsArray: UserItemMapping[] = stored ? JSON.parse(stored) : [];
		return new Set(mappingsArray);
	}

	private saveMappings(mappings: Set<UserItemMapping>): void {
		localStorage.setItem(
			this.STORAGE_KEY,
			JSON.stringify(Array.from(mappings)),
		);
	}

	getMappings() {
		return this.userItemMappings;
	}

	addMapping(userId: number, itemId: number, quantity: number): void {
		const existingMapping = this.userItemMappings().find(
			(m) => m.userId === userId && m.itemId === itemId,
		);

		if (existingMapping) {
			this.updateMapping(userId, itemId, quantity);
		} else {
			this.userItemMappingsSet.update(
				(mappings) => new Set([...mappings, { userId, itemId, quantity }]),
			);
		}
	}

	updateMapping(userId: number, itemId: number, quantity: number): void {
		this.userItemMappingsSet.update((mappings) => {
			const newSet = new Set<UserItemMapping>();
			for (const mapping of mappings) {
				if (mapping.userId === userId && mapping.itemId === itemId) {
					newSet.add({ ...mapping, quantity });
				} else {
					newSet.add(mapping);
				}
			}
			return newSet;
		});
	}

	removeMapping(userId: number, itemId: number): void {
		this.userItemMappingsSet.update((mappings) => {
			const newSet = new Set(mappings);
			for (const mapping of newSet) {
				if (mapping.userId === userId && mapping.itemId === itemId) {
					newSet.delete(mapping);
					break;
				}
			}
			return newSet;
		});
	}

	removeUserMappings(userId: number): void {
		this.userItemMappingsSet.update((mappings) => {
			const newSet = new Set<UserItemMapping>();
			for (const mapping of mappings) {
				if (mapping.userId !== userId) {
					newSet.add(mapping);
				}
			}
			return newSet;
		});
	}

	removeItemMappings(itemId: number): void {
		this.userItemMappingsSet.update((mappings) => {
			const newSet = new Set<UserItemMapping>();
			for (const mapping of mappings) {
				if (mapping.itemId !== itemId) {
					newSet.add(mapping);
				}
			}
			return newSet;
		});
	}

	getBillCalculation = computed((): BillEntry[] => {
		const users = this.usersService.users();
		const items: Item[] = this.itemsService.getItems()();
		const mappings = this.userItemMappings();

		return users.map((user) => {
			const userMappings = mappings.filter((m) => m.userId === user.id);
			const userItems: BillItemEntry[] = userMappings
				.map((mapping) => {
					const item: Item | undefined = items.find(
						(i) => i.id === mapping.itemId,
					);
					if (!item) return null;

					return {
						item,
						assignedQuantity: mapping.quantity,
						total: item.price * mapping.quantity,
					};
				})
				.filter((item): item is BillItemEntry => item !== null);

			const totalBill = userItems.reduce((sum, item) => sum + item.total, 0);

			return {
				userId: user.id,
				userName: user.name,
				items: userItems,
				totalBill,
			};
		});
	});
}
