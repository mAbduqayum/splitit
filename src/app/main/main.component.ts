import { Component } from "@angular/core";
import { ToastComponent } from "../components/toast/toast.component";
import { ToastUsageComponent } from "../components/toast/toast-usage/toast-usage.component";

@Component({
	selector: "app-main",
	imports: [ToastComponent, ToastUsageComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
