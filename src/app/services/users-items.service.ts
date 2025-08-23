import { computed, effect, Injectable, inject, signal } from "@angular/core";
import { ItemsService, Item } from "./items.service";
import { UsersService } from "./users.service";

export interface UserItemMapping {
	userId: number;
	itemId: number;
	quantity: number;
}

export interface BillItemEntry {
	itemId: number;
	itemName: string;
	unitPrice: number;
	quantity: number;
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
	private readonly userItemMappings = signal<UserItemMapping[]>(
		this.loadMappings(),
	);

	private usersService = inject(UsersService);
	private itemsService = inject(ItemsService);

	constructor() {
		effect(() => {
			this.saveMappings(this.userItemMappings());
		});
	}

	private loadMappings(): UserItemMapping[] {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	}

	private saveMappings(mappings: UserItemMapping[]): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mappings));
	}

	getMappings() {
		return this.userItemMappings.asReadonly();
	}

	addMapping(userId: number, itemId: number, quantity: number): void {
		const existingMapping = this.userItemMappings().find(
			(m) => m.userId === userId && m.itemId === itemId,
		);

		if (existingMapping) {
			this.updateMapping(userId, itemId, quantity);
		} else {
			this.userItemMappings.update((mappings) => [
				...mappings,
				{ userId, itemId, quantity },
			]);
		}
	}

	updateMapping(userId: number, itemId: number, quantity: number): void {
		this.userItemMappings.update((mappings) =>
			mappings.map((mapping) =>
				mapping.userId === userId && mapping.itemId === itemId
					? { ...mapping, quantity }
					: mapping,
			),
		);
	}

	removeMapping(userId: number, itemId: number): void {
		this.userItemMappings.update((mappings) =>
			mappings.filter((m) => !(m.userId === userId && m.itemId === itemId)),
		);
	}

	removeUserMappings(userId: number): void {
		this.userItemMappings.update((mappings) =>
			mappings.filter((m) => m.userId !== userId),
		);
	}

	removeItemMappings(itemId: number): void {
		this.userItemMappings.update((mappings) =>
			mappings.filter((m) => m.itemId !== itemId),
		);
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
						itemId: item.id,
						itemName: item.name,
						unitPrice: item.price,
						quantity: mapping.quantity,
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
