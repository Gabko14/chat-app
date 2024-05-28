import { Injectable } from "@angular/core"

@Injectable({
	providedIn: "root",
})
export class PermissionService {
	constructor() {}

	public areNotificationsGranted() {
		return Notification.permission == "granted"
	}
}
