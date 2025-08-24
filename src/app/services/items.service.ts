import { Injectable } from "@angular/core";
import { BaseStorage } from "./base-storage.class";

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
