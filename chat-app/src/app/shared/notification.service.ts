import { Injectable, OnDestroy } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, takeUntil } from "rxjs"
import { getToken, Messaging } from "@angular/fire/messaging"
import { MatSnackBar } from "@angular/material/snack-bar"
import { PermissionService } from "./permission.service"
import { HttpErrorHandlerService } from "./http-error-handler.service"

@Injectable({
	providedIn: "root",
})
export class NotificationService implements OnDestroy {
	private backendUrl = environment.apiUrl
	private notificationsEndpoint = this.backendUrl + "notifications"
	private readonly destroyed = new ReplaySubject<void>()
	private _areChatNotificationsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

	constructor(
		private readonly http: HttpClient,
		private readonly matSnackBar: MatSnackBar,
		private readonly messaging: Messaging,
		private readonly permissionService: PermissionService,
		private readonly httpErrorHandlerService: HttpErrorHandlerService
	) {
		this._areChatNotificationsReady.next(
			this.permissionService.areNotificationsGranted() && this.isUserSubscribedToNotifications()
		)
	}

	public areChatNotificationsReady$: Observable<boolean> =
		this._areChatNotificationsReady.asObservable()

	public subscribeToNotifications() {
		navigator.serviceWorker.getRegistration("./ngsw-worker.js").then((registration) => {
			getToken(this.messaging, {
				vapidKey: environment.vapidKey,
				serviceWorkerRegistration: registration,
			})
				.then((currentToken) => {
					this.addPushSubscriber(currentToken)
						.pipe(takeUntil(this.destroyed))
						.subscribe(() => {
							this.matSnackBar.open("You subscribed to Notifications!", "Ok", { duration: 2000 })
							this._areChatNotificationsReady.next(true)
							localStorage.setItem("fcmRegistrationToken", currentToken)
						})
				})
				.catch((err) => {
					if (!this.permissionService.areNotificationsGranted()) {
						this.matSnackBar.open("Please enable the Notifications permission!", "Ok", {
							duration: 3000,
						})
						this.askForNotificationsPermission()
					} else {
						console.error(err)
						this.matSnackBar.open("An Error Occured while subscribing to notifications", "Ok", {
							duration: 3000,
						})
					}
					this._areChatNotificationsReady.next(false)
					localStorage.removeItem("fcmRegistrationToken")
				})
		})
	}

	// TODO remove
	public askForNotificationsPermission() {
		Notification.requestPermission().then((result: NotificationPermission) => {
			if (result === "granted") {
				this.matSnackBar.open("Notifications permission granted", "Ok", { duration: 3000 })
				navigator.serviceWorker.ready.then(function (registration) {
					registration.showNotification("Notification with ServiceWorker")
				})
			} else if (result === "denied") {
				this.matSnackBar.open("You denied the Notifications permission", "Ok", { duration: 3000 })
			} else if (result === "default") {
				this.matSnackBar.open("Requestpermission result: default", "Ok", { duration: 3000 })
			}
		})
	}

	private addPushSubscriber(fcmRegistrationToken: string) {
		return this.http
			.post(this.notificationsEndpoint + "/add-subscriber", null, {
				params: { fcmRegistrationToken },
			})
			.pipe(
				catchError((error) => {
					this.httpErrorHandlerService.handleHttpError()
					return of(error)
				})
			)
	}

	public isUserSubscribedToNotifications() {
		// TODO Does FCM have it's own logic for this? Rather than just using the local storage
		return localStorage.getItem("fcmRegistrationToken") !== null
	}

	ngOnDestroy() {
		this.destroyed.next()
		this.destroyed.complete()
	}
}
