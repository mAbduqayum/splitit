import { effect, signal } from "@angular/core";
import { ToastService } from "../components/toast/toast.service";

export class BaseStorage<T extends { id: number }> {
	readonly self = signal<Array<T>>([]);

	protected constructor(
		protected readonly storageKey: string,
		protected readonly toastService: ToastService,
	) {
		this.#sync();
	}

	#sync(): void {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored !== null) {
				this.self.set(JSON.parse(stored));
			}
			this.toastService.add(`Loaded ${this.storageKey} from storage`, "info");
		} catch (e) {
			this.toastService.add(
				`Failed to load ${this.storageKey} from storage`,
				"error",
			);
		}

		effect(() => {
			try {
				localStorage.setItem(this.storageKey, JSON.stringify(this.self()));
			} catch (e) {
				this.toastService.add(
					`Failed to save ${this.storageKey} to storage`,
					"error",
				);
			}
		});
	}

	add(itemData: Omit<T, "id">): void {
		const newItem = {
			id: Date.now(),
			...itemData,
		} as T;

		this.self.update((items) => {
			return [...items, newItem];
		});
	}

	update(item: T): void {
		this.self.update((items) => {
			const filtered = [...items].filter((i) => i.id !== item.id);
			return [...filtered, item];
		});
	}

	remove(item: T): void {
		this.self.update((users) => {
			return [...users].filter((u) => u.id !== item.id);
		});
	}

	clear(): void {
		this.self.set([]);
		this.toastService.add(`Cleared ${this.storageKey}`, "warning");
	}
}
