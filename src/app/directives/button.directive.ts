import { computed, Directive, input } from "@angular/core";

export type ButtonType =
	| "primary"
	| "secondary"
	| "danger"
	| "success"
	| "warning"
	| "info";

@Directive({
	selector: "[appBtn]",
	host: {
		"[class]": "buttonClass()",
	},
})
export class ButtonDirective {
	appBtn = input<ButtonType>("primary");

	buttonClass = computed(() => `btn btn-${this.appBtn()}`);
}
