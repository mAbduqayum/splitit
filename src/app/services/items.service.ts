import { Injectable, inject } from "@angular/core";
import { ToastService } from "../components/toast/toast.service";
import { BaseStorage } from "./base-storage.class";

export interface Item {
	id: string;
	price: number;
}

@Injectable({
	providedIn: "root",
})
export class ItemsService extends BaseStorage<Item> {
	constructor() {
		super("items");
	}
}
