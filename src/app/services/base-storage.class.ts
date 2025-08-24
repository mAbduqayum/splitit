import { effect, inject, signal } from "@angular/core";
import { ToastService } from "../components/toast/toast.service";

interface ItemId {
	id: string | number;
}

export class BaseStorage<T extends ItemId> {
	readonly store = signal<Array<T>>([]);
	#toastService = inject(ToastService);

	protected constructor(protected readonly storageKey: string) {
		this.#sync();
	}

	clear(): void {
		this.store.set([]);
		this.#toastService.add(`Cleared ${this.storageKey}`, "warning");
	}

	add(item: T): void {
		const existingIds = this.store().map((item) => item.id);
		if (existingIds.includes(item.id)) {
			this.#toastService.add(`Item with id ${item.id} already exists`, "error");
		}
		this.store.update((items) => {
			return [...items, item];
		});
	}

	update(item: T): void {
		this.store.update((items) => {
			const filtered = [...items].filter((i) => i.id !== item.id);
			return [...filtered, item];
		});
	}

	remove(item: T): void {
		this.store.update((users) => {
			return [...users].filter((u) => u.id !== item.id);
		});
	}

	#sync(): void {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored !== null) {
				this.store.set(JSON.parse(stored));
			}
			this.#toastService.add(`Loaded ${this.storageKey} from storage`, "info");
		} catch (e) {
			this.#toastService.add(
				`Failed to load ${this.storageKey} from storage`,
				"error",
			);
		}

		effect(() => {
			try {
				localStorage.setItem(this.storageKey, JSON.stringify(this.store()));
			} catch (e) {
				this.#toastService.add(
					`Failed to save ${this.storageKey} to storage`,
					"error",
				);
			}
		});
	}
}
