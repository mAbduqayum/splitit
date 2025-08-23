import { Component } from "@angular/core";
import { ToastComponent } from "../components/toast/toast.component";

@Component({
	selector: "app-main",
	imports: [ToastComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
