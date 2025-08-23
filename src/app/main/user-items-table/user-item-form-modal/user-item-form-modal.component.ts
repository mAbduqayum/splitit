import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	inject,
	Injector,
	input,
	OnChanges,
	OnInit,
	output,
	signal,
} from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { ButtonDirective } from "../../../directives/button.directive";
import { User } from "../../../services/users.service";
import { Item } from "../../../services/items.service";

export type ModalType = "addUser" | "editUser" | "addItem" | "editItem";

export interface ModalData {
	user?: User;
	item?: Item;
}

@Component({
	selector: "app-user-item-form-modal",
	imports: [FormsModule, ReactiveFormsModule, ButtonDirective],
	templateUrl: "./user-item-form-modal.component.html",
	styleUrl: "./user-item-form-modal.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemFormModalComponent implements OnInit, OnChanges {
	private injector = inject(Injector);

	// Inputs
	modalType = input.required<ModalType>();
	modalData = input<ModalData | null>(null);
	isVisible = input<boolean>(false);

	// Outputs
	userSubmitted = output<{ name: string; isEdit: boolean; user?: User }>();
	itemSubmitted = output<{
		name: string;
		quantity: number;
		price: number;
		isEdit: boolean;
		item?: Item;
	}>();
	closed = output<void>();

	// Forms
	userForm = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(1)]),
	});

	itemForm = new FormGroup({
		name: new FormControl("", [Validators.required, Validators.minLength(1)]),
		quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
		price: new FormControl(0, [Validators.required, Validators.min(0)]),
	});

	// Computed properties
	get isUserModal() {
		return this.modalType() === "addUser" || this.modalType() === "editUser";
	}

	get isItemModal() {
		return this.modalType() === "addItem" || this.modalType() === "editItem";
	}

	get isEditMode() {
		return this.modalType() === "editUser" || this.modalType() === "editItem";
	}

	get modalTitle() {
		const titles = {
			addUser: "Add User",
			editUser: "Edit User",
			addItem: "Add Item",
			editItem: "Edit Item",
		};
		return titles[this.modalType()];
	}

	get submitButtonText() {
		return this.isEditMode
			? this.isUserModal
				? "Update User"
				: "Update Item"
			: this.isUserModal
				? "Add User"
				: "Add Item";
	}

	ngOnInit() {
		// Watch for modal data changes and update forms accordingly
		const data = this.modalData();
		if (data?.user) {
			this.userForm.patchValue({ name: data.user.name });
		}
		if (data?.item) {
			this.itemForm.patchValue({
				name: data.item.name,
				quantity: data.item.quantity,
				price: data.item.price,
			});
		}

		// Auto-focus first input when modal becomes visible
		if (this.isVisible()) {
			afterNextRender(
				() => {
					const input = document.querySelector(
						".modal-form input",
					) as HTMLInputElement;
					if (input) {
						input.focus();
						if (this.isEditMode) {
							input.select();
						}
					}
				},
				{ injector: this.injector },
			);
		}
	}

	ngOnChanges() {
		// Update forms when modal data changes
		const data = this.modalData();
		if (data?.user && this.isUserModal) {
			this.userForm.patchValue({ name: data.user.name });
		}
		if (data?.item && this.isItemModal) {
			this.itemForm.patchValue({
				name: data.item.name,
				quantity: data.item.quantity,
				price: data.item.price,
			});
		}

		// Auto-focus when modal becomes visible
		if (this.isVisible()) {
			afterNextRender(
				() => {
					const input = document.querySelector(
						".modal-form input",
					) as HTMLInputElement;
					if (input) {
						input.focus();
						if (this.isEditMode) {
							input.select();
						}
					}
				},
				{ injector: this.injector },
			);
		}
	}

	onSubmitUser() {
		if (this.userForm.valid) {
			const name = this.userForm.value.name!.trim();
			const data = this.modalData();
			this.userSubmitted.emit({
				name,
				isEdit: this.isEditMode,
				user: data?.user,
			});
			this.userForm.reset({ name: "" });
		}
	}

	onSubmitItem() {
		if (this.itemForm.valid) {
			const { name, quantity, price } = this.itemForm.value;
			const data = this.modalData();
			this.itemSubmitted.emit({
				name: name!.trim(),
				quantity: quantity!,
				price: price!,
				isEdit: this.isEditMode,
				item: data?.item,
			});
			this.itemForm.reset({ name: "", quantity: 1, price: 0 });
		}
	}

	onClose() {
		this.userForm.reset({ name: "" });
		this.itemForm.reset({ name: "", quantity: 1, price: 0 });
		this.closed.emit();
	}

	onOverlayClick() {
		this.onClose();
	}

	onModalClick(event: Event) {
		event.stopPropagation();
	}
}
