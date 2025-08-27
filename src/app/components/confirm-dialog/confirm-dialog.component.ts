import { Component, HostListener, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from "@angular/material/dialog";

export interface ConfirmDialogData {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}

@Component({
	selector: "app-confirm-dialog",
	imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
	templateUrl: "./confirm-dialog.component.html",
	styleUrl: "./confirm-dialog.component.scss",
})
export class ConfirmDialogComponent {
	readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
	readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	@HostListener("document:keydown.escape")
	onCancel(): void {
		this.dialogRef.close(false);
	}
}
