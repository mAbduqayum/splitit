import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { UsersItemsService } from "../../services/users-items.service";
import { UsersService, User } from "../../services/users.service";
import { ItemsService, Item } from "../../services/items.service";
import {
	UserItemFormModalComponent,
	ModalType,
	ModalData,
} from "./user-item-form-modal/user-item-form-modal.component";

@Component({
	selector: "app-user-items-table",
	imports: [FormsModule, ButtonDirective, UserItemFormModalComponent],
	templateUrl: "./user-items-table.component.html",
	styleUrl: "./user-items-table.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemsTableComponent {
	private usersItemsService = inject(UsersItemsService);
	private usersService = inject(UsersService);
	private itemsService = inject(ItemsService);
	private injector = inject(Injector);

	users = computed(() => this.usersService.users());
	items = computed(() => this.itemsService.getItems()());
	mappings = computed(() => this.usersItemsService.getMappings()());
	billCalculations = computed(() =>
		this.usersItemsService.getBillCalculation(),
	);

	editingCell = signal<{ userId: number; itemId: number } | null>(null);
	editingQuantity = signal<number>(0);

	// Modal management
	modalType = signal<ModalType | null>(null);
	modalData = signal<ModalData | null>(null);

	get isModalVisible() {
		return this.modalType() !== null;
	}

	// Tip and tax
	tipPercentage = signal<number>(10); // Default 10%
	taxPercentage = signal<number>(0); // Default 0%
	editingTipPercentage = signal<boolean>(false);
	editingTaxPercentage = signal<boolean>(false);
	tempTipPercentage = signal<number>(10);
	tempTaxPercentage = signal<number>(0);

	// Tip and tax editing methods
	startEditTip() {
		this.tempTipPercentage.set(this.tipPercentage());
		this.editingTipPercentage.set(true);

		afterNextRender(
			() => {
				const input = document.querySelector(
					".edit-tip-input",
				) as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEditTip() {
		setTimeout(() => {
			const activeElement = document.activeElement;
			const isEditInput = activeElement?.classList.contains("edit-tip-input");

			if (!isEditInput) {
				this.editingTipPercentage.set(false);
			}
		}, 0);
	}

	updateTipPercentage() {
		const value = this.tempTipPercentage();
		if (value >= 0 && value <= 100) {
			this.tipPercentage.set(value);
		}
	}

	startEditTax() {
		this.tempTaxPercentage.set(this.taxPercentage());
		this.editingTaxPercentage.set(true);

		afterNextRender(
			() => {
				const input = document.querySelector(
					".edit-tax-input",
				) as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEditTax() {
		setTimeout(() => {
			const activeElement = document.activeElement;
			const isEditInput = activeElement?.classList.contains("edit-tax-input");

			if (!isEditInput) {
				this.editingTaxPercentage.set(false);
			}
		}, 0);
	}

	updateTaxPercentage() {
		const value = this.tempTaxPercentage();
		if (value >= 0 && value <= 100) {
			this.taxPercentage.set(value);
		}
	}

	getQuantity(userId: number, itemId: number): number {
		const mapping = this.mappings().find(
			(m: any) => m.userId === userId && m.itemId === itemId,
		);
		return mapping?.quantity || 0;
	}

	startEdit(userId: number, itemId: number, currentQuantity: number) {
		this.editingCell.set({ userId, itemId });
		this.editingQuantity.set(currentQuantity);
	}

	stopEdit() {
		this.editingCell.set(null);
		this.editingQuantity.set(0);
	}

	updateQuantity(userId: number, itemId: number) {
		const quantity = this.editingQuantity();
		if (quantity > 0) {
			this.usersItemsService.addMapping(userId, itemId, quantity);
		} else if (quantity === 0) {
			this.usersItemsService.removeMapping(userId, itemId);
		}
	}

	isEditing(userId: number, itemId: number): boolean {
		const editing = this.editingCell();
		return editing?.userId === userId && editing?.itemId === itemId;
	}

	getUserBill(userId: number): number {
		const bill = this.billCalculations().find((b) => b.userId === userId);
		return bill?.totalBill || 0;
	}

	startEditUser(userId: number, currentName: string) {
		const user = this.users().find((u: any) => u.id === userId);
		if (user) {
			this.modalType.set("editUser");
			this.modalData.set({ user });
		}
	}

	removeUser(userId: number) {
		this.usersService.removeUser(userId);
		this.usersItemsService.removeUserMappings(userId);
	}

	startEditItem(
		itemId: number,
		currentName: string,
		currentQuantity: number,
		currentPrice: number,
	) {
		const item = this.items().find((i: any) => i.id === itemId);
		if (item) {
			this.modalType.set("editItem");
			this.modalData.set({ item });
		}
	}

	removeItem(itemId: number) {
		this.itemsService.removeItem(itemId);
		this.usersItemsService.removeItemMappings(itemId);
	}

	// Check if item quantity matches assigned quantities
	hasQuantityMismatch(itemId: number): boolean {
		const item = this.items().find((i: any) => i.id === itemId);
		if (!item) return false;

		const totalAssigned = this.mappings()
			.filter((m: any) => m.itemId === itemId)
			.reduce((sum: number, m: any) => sum + m.quantity, 0);

		return Math.abs(totalAssigned - item.quantity) > 0.01; // Allow small floating point differences
	}

	// Modal methods
	showAddUserForm() {
		this.modalType.set("addUser");
		this.modalData.set(null);
	}

	showAddItemForm() {
		this.modalType.set("addItem");
		this.modalData.set(null);
	}

	closeModal() {
		this.modalType.set(null);
		this.modalData.set(null);
	}

	// Modal event handlers
	onUserSubmitted(event: { name: string; isEdit: boolean; user?: User }) {
		let success = true;

		if (event.isEdit && event.user) {
			this.usersService.updateUser(event.user.id, event.name);
		} else {
			const newUser = {
				id: Date.now(),
				name: event.name,
			};
			success = this.usersService.addUser(newUser);
		}

		if (success) {
			this.closeModal();
		} else {
			// Keep modal open, user will see console warning
			// Could add toast notification here in the future
		}
	}

	onItemSubmitted(event: {
		name: string;
		quantity: number;
		price: number;
		isEdit: boolean;
		item?: Item;
	}) {
		let success = true;

		if (event.isEdit && event.item) {
			this.itemsService.updateItem(event.item.id, {
				name: event.name,
				quantity: event.quantity,
				price: event.price,
			});
		} else {
			success = this.itemsService.addItem(
				event.name,
				event.quantity,
				event.price,
			);
		}

		if (success) {
			this.closeModal();
		} else {
			// Keep modal open, user will see console warning
			// Could add toast notification here in the future
		}
	}

	// Calculate grand total
	getGrandTotal(): number {
		return this.billCalculations().reduce(
			(sum, bill) => sum + bill.totalBill,
			0,
		);
	}

	// Calculate tip amount for a user
	getUserTip(userId: number): number {
		const subtotal = this.getUserBill(userId);
		return (subtotal * this.tipPercentage()) / 100;
	}

	// Calculate tax amount for a user
	getUserTax(userId: number): number {
		const subtotal = this.getUserBill(userId);
		return (subtotal * this.taxPercentage()) / 100;
	}

	// Calculate user total including tip and tax
	getUserTotal(userId: number): number {
		const subtotal = this.getUserBill(userId);
		const tip = this.getUserTip(userId);
		const tax = this.getUserTax(userId);
		return subtotal + tip + tax;
	}

	// Calculate grand tip total
	getGrandTipTotal(): number {
		const subtotal = this.getGrandTotal();
		return (subtotal * this.tipPercentage()) / 100;
	}

	// Calculate grand tax total
	getGrandTaxTotal(): number {
		const subtotal = this.getGrandTotal();
		return (subtotal * this.taxPercentage()) / 100;
	}

	// Calculate final grand total including tip and tax
	getFinalGrandTotal(): number {
		const subtotal = this.getGrandTotal();
		const tip = this.getGrandTipTotal();
		const tax = this.getGrandTaxTotal();
		return subtotal + tip + tax;
	}

	// Clear all data
	clearAllData() {
		// Clear all mappings
		this.mappings().forEach(() => {});
		// Clear users (this will trigger the effect to remove mappings)
		this.users().forEach((user) => this.removeUser(user.id));
		// Clear items (this will trigger the effect to remove mappings)
		this.items().forEach((item: any) => this.removeItem(item.id));
		// Reset tip and tax to defaults
		this.tipPercentage.set(10);
		this.taxPercentage.set(0);
	}
}
