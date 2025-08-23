import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { UsersItemsService } from "../../services/users-items.service";
import { UsersService } from "../../services/users.service";
import { ItemsService } from "../../services/items.service";

@Component({
	selector: "app-user-items-table",
	imports: [FormsModule, ReactiveFormsModule, ButtonDirective],
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

	// User management
	editingUserId = signal<number | null>(null);
	editingUserName = signal<string>("");
	userForm = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(1)]),
	});

	// Item management
	editingItemId = signal<number | null>(null);
	editingItemName = signal<string>("");
	editingItemQuantity = signal<number>(1);
	editingItemPrice = signal<number>(0);
	itemForm = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(1)]),
		quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
		price: new FormControl(0, [Validators.required, Validators.min(0)]),
	});

	// Corner cell management
	showingAddUserForm = signal<boolean>(false);
	showingAddItemForm = signal<boolean>(false);

	// Tip and tax
	tipPercentage = signal<number>(10); // Default 10%
	taxPercentage = signal<number>(0); // Default 0%
	editingTipPercentage = signal<boolean>(false);
	editingTaxPercentage = signal<boolean>(false);
	tempTipPercentage = signal<number>(10);
	tempTaxPercentage = signal<number>(0);

	getQuantity(userId: number, itemId: number): number {
		const mapping = this.mappings().find(
			(m) => m.userId === userId && m.itemId === itemId,
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

	// User management methods
	addUser() {
		if (this.userForm.valid) {
			const name = this.userForm.value.name!;
			const newUser = {
				id: Date.now(),
				name: name.trim(),
			};
			this.usersService.addUser(newUser);
			this.userForm.reset({ name: "" });
		}
	}

	startEditUser(userId: number, currentName: string) {
		this.editingUserId.set(userId);
		this.editingUserName.set(currentName);

		afterNextRender(
			() => {
				const input = document.querySelector(
					".edit-user-input",
				) as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEditUser() {
		setTimeout(() => {
			const activeElement = document.activeElement;
			const isEditInput = activeElement?.classList.contains("edit-user-input");

			if (!isEditInput) {
				this.editingUserId.set(null);
				this.editingUserName.set("");
			}
		}, 0);
	}

	updateUser(userId: number) {
		const newName = this.editingUserName().trim();
		if (newName) {
			this.usersService.updateUser(userId, newName);
		}
	}

	removeUser(userId: number) {
		this.usersService.removeUser(userId);
		this.usersItemsService.removeUserMappings(userId);
	}

	// Item management methods
	addItem() {
		if (this.itemForm.valid) {
			const { name, quantity, price } = this.itemForm.value;
			this.itemsService.addItem(name!, quantity!, price!);
			this.itemForm.reset({ name: "", quantity: 1, price: 0 });
		}
	}

	startEditItem(
		itemId: number,
		currentName: string,
		currentQuantity: number,
		currentPrice: number,
	) {
		this.editingItemId.set(itemId);
		this.editingItemName.set(currentName);
		this.editingItemQuantity.set(currentQuantity);
		this.editingItemPrice.set(currentPrice);

		afterNextRender(
			() => {
				const input = document.querySelector(
					".edit-item-name-input",
				) as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEditItem() {
		setTimeout(() => {
			const activeElement = document.activeElement;
			const isEditInput =
				activeElement?.classList.contains("edit-item-name-input") ||
				activeElement?.classList.contains("edit-item-quantity-input") ||
				activeElement?.classList.contains("edit-item-price-input");

			if (!isEditInput) {
				this.editingItemId.set(null);
				this.editingItemName.set("");
				this.editingItemQuantity.set(1);
				this.editingItemPrice.set(0);
			}
		}, 0);
	}

	updateItemName(itemId: number) {
		const newName = this.editingItemName().trim();
		if (newName) {
			this.itemsService.updateItem(itemId, { name: newName });
		}
	}

	updateItemQuantity(itemId: number) {
		const quantity = this.editingItemQuantity();
		if (quantity >= 1) {
			this.itemsService.updateItem(itemId, { quantity });
		}
	}

	updateItemPrice(itemId: number) {
		const price = this.editingItemPrice();
		if (price >= 0) {
			this.itemsService.updateItem(itemId, { price });
		}
	}

	removeItem(itemId: number) {
		this.itemsService.removeItem(itemId);
		this.usersItemsService.removeItemMappings(itemId);
	}

	get userNameControl() {
		return this.userForm.controls.name;
	}

	get itemNameControl() {
		return this.itemForm.controls.name;
	}

	get itemQuantityControl() {
		return this.itemForm.controls.quantity;
	}

	get itemPriceControl() {
		return this.itemForm.controls.price;
	}

	// Check if item quantity matches assigned quantities
	hasQuantityMismatch(itemId: number): boolean {
		const item = this.items().find((i) => i.id === itemId);
		if (!item) return false;

		const totalAssigned = this.mappings()
			.filter((m) => m.itemId === itemId)
			.reduce((sum, m) => sum + m.quantity, 0);

		return Math.abs(totalAssigned - item.quantity) > 0.01; // Allow small floating point differences
	}

	// Corner cell methods
	showAddUserForm() {
		this.showingAddUserForm.set(true);
		this.showingAddItemForm.set(false);
	}

	showAddItemForm() {
		this.showingAddItemForm.set(true);
		this.showingAddUserForm.set(false);
	}

	hideAddForms() {
		this.showingAddUserForm.set(false);
		this.showingAddItemForm.set(false);
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
		this.items().forEach((item) => this.removeItem(item.id));
		// Reset tip and tax to defaults
		this.tipPercentage.set(10);
		this.taxPercentage.set(0);
	}
}
