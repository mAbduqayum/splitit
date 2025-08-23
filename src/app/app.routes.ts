import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		loadComponent: () =>
			import("./main/main.component").then((m) => m.MainComponent),
	},
];
