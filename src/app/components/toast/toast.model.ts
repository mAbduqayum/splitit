export type ToastType = "info" | "success" | "warning" | "error";
export type ToastIcon = "info" | "check_circle" | "warning" | "error";

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
	icon: ToastIcon;
}

export function newToast(message: string, type: ToastType): Toast {
	return {
		id: Date.now(),
		message,
		type,
		icon: getIcon(type),
	};
}

function getIcon(s: string): ToastIcon {
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
	return "info";
}
