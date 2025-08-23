export type ToastType = "info" | "success" | "warning" | "error";
export type ToastIcon = "info" | "check_circle" | "warning" | "error";

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
	icon: ToastIcon;
	color: string;
}

export function newToast(message: string, type: ToastType): Toast {
	return {
		id: Date.now(),
		message,
		type,
		icon: getIcon(type),
		color: getToastColor(type),
	};
}

function getIcon(s: ToastType): ToastIcon {
	switch (s) {
		case "info":
			return "info";
		case "success":
			return "check_circle";
		case "warning":
			return "warning";
		case "error":
			return "error";
	}
}

function getToastColor(s: ToastType): string {
	switch (s) {
		case "info":
			return "#3b82f6";
		case "success":
			return "#10b981";
		case "warning":
			return "#f59e0b";
		case "error":
			return "#ef4444";
	}
}
