import {
	afterNextRender,
	Component,
	computed,
	Injector,
	inject,
	signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonDirective } from "../../directives/button.directive";
import { ItemsService } from "../../services/items.service";

@Component({
	selector: "app-items-list",
	imports: [ButtonDirective, FormsModule],
	templateUrl: "./items-list.component.html",
	styleUrl: "./items-list.component.css",
})
export class ItemsListComponent {
	service = inject(ItemsService);
	injector = inject(Injector);

	items = computed(() => this.service.getItems()());
	editingItemId = signal<number | null>(null);
	editingItemName = signal<string>("");
	editingItemQuantity = signal<number>(1);
	editingItemPrice = signal<number>(0);

	onRemoveItem(itemId: number) {
		this.service.removeItem(itemId);
	}

	startEdit(
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
					".edit-name-input",
				) as HTMLInputElement;
				if (input) {
					input.focus();
					input.select();
				}
			},
			{ injector: this.injector },
		);
	}

	stopEdit() {
		// Use setTimeout to check if focus moved to another edit input
		setTimeout(() => {
			const activeElement = document.activeElement;
			const isEditInput =
				activeElement?.classList.contains("edit-name-input") ||
				activeElement?.classList.contains("edit-quantity-input") ||
				activeElement?.classList.contains("edit-price-input");

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
			this.service.updateItem(itemId, { name: newName });
		}
	}

	updateItemQuantity(itemId: number) {
		const quantity = this.editingItemQuantity();
		if (quantity >= 1) {
			this.service.updateItem(itemId, { quantity });
		}
	}

	updateItemPrice(itemId: number) {
		const price = this.editingItemPrice();
		if (price >= 0) {
			this.service.updateItem(itemId, { price });
		}
	}
}
