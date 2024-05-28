import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { catchError, Observable, of } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class NotificationService {
	private backendUrl = environment.apiUrl
	private notificationsEndpoint = this.backendUrl + "notifications"

	constructor(private http: HttpClient) {}

	addPushSubscriber(fcmRegistrationToken: string) {
		return this.http
			.post(this.notificationsEndpoint + "/add-subscriber", null, {
				params: { fcmRegistrationToken },
			})
			.pipe(
				catchError((error: Error): Observable<Error> => {
					console.error("There was an error!", error)
					return of(error)
				})
			)
	}

	sendToEveryone(notification: Notification) {
		return this.http
			.post(this.notificationsEndpoint + "/send-everyone-notification", notification)
			.pipe(
				catchError((error: Error): Observable<Error> => {
					console.error("There was an error!", error)
					return of(error)
				})
			)
	}
}
