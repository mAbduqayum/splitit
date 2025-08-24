import { inject, Injectable } from "@angular/core";
import { BaseStorage } from "./base-storage.class";
import { ToastService } from "../components/toast/toast.service";

export interface Item {
	id: number;
	name: string;
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
