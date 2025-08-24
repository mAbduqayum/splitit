import { Component } from "@angular/core";
import { SummaryComponent } from "../components/summary/summary.component";

@Component({
	selector: "app-main",
	imports: [SummaryComponent],
	templateUrl: "./main.component.html",
	styleUrl: "./main.component.css",
})
export class MainComponent {}
