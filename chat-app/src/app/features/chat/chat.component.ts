import { CommonModule } from "@angular/common"
import { ChatService } from "./chat.service"
import { FormsModule } from "@angular/forms"
import { Message } from "./message"
import { NotificationService } from "../../shared/notification.service"
import { MatButton } from "@angular/material/button"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { map, mergeMap, ReplaySubject, switchMap, takeUntil } from "rxjs"
import { getToken, Messaging } from "@angular/fire/messaging"
import { PermissionService } from "../../shared/permission.service"
import { AuthService } from "../auth/auth.service"

@Component({
	selector: "app-chat",
	standalone: true,
	template: `
    <section class="">
      <span *ngIf="areChatNotificationsReady" style="color: green">Notifications Activated!</span>
      <span *ngIf="!areChatNotificationsReady" style="color: red">Notifications Disabled!</span>
      <button mat-raised-button class="button button-primary" (click)="subscribeToNotifications()">
        Subscribe to Notifications
      </button>
      <br>
      <article class="pb-10">
        <div *ngFor="let message of messages">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </article>
      <input [(ngModel)]="userInputMessage" type="text" placeholder="Enter message"/>
      <button (click)="sendMessage(getUsername() ?? 'Guest', this.userInputMessage)">Send</button>
    </section>
  `,
	styles: [""],
	imports: [CommonModule, FormsModule, MatButton, MatSnackBarModule],
})
export class ChatComponent implements OnInit, OnDestroy {
	protected messages: Message[] = []
	protected userInputMessage: string = ""
	protected areChatNotificationsReady: boolean = false
	private readonly destroyed = new ReplaySubject<void>()

	constructor(
		private readonly signalRService: ChatService,
		private readonly notificationService: NotificationService,
		private readonly messaging: Messaging,
		private readonly matSnackBar: MatSnackBar,
		private readonly permissionService: PermissionService,
		private readonly authSercice: AuthService
	) {}

	ngOnInit() {
		this.initializeChat()
		this.authSercice.login()
		this.areChatNotificationsReady =
			this.permissionService.areNotificationsGranted() &&
			localStorage.getItem("fcmRegistrationToken") != null
	}

	private initializeChat() {
		this.signalRService
			.getAllMessages()
			.pipe(takeUntil(this.destroyed))
			.subscribe((messages) => {
				this.messages = messages
			})

		this.signalRService
			.startConnection()
			.pipe(
				takeUntil(this.destroyed),
				mergeMap(() => {
					return this.signalRService.receiveMessage().pipe(
						map((message) => {
							this.messages.push({ sender: message.sender, content: message.content })
						})
					)
				})
			)
			.subscribe()
	}

	protected subscribeToNotifications() {
		navigator.serviceWorker.getRegistration("./ngsw-worker.js").then((registration) => {
			getToken(this.messaging, {
				vapidKey:
					"BM2criD6hTHh6lIBOBhMeFwJd_2mH25gPgeB89Zt5naafhPrdfiA3T7VoXWDNDExLnWvHP47kbEPIx_u5CBh5b0", // Get your own vapid key
				serviceWorkerRegistration: registration,
			})
				.then((currentToken) => {
					this.notificationService
						.addPushSubscriber(currentToken)
						.pipe(takeUntil(this.destroyed))
						.subscribe()
					this.matSnackBar.open("You subscribed to Notifications!", "Ok", { duration: 2000 })
					this.areChatNotificationsReady = true
					localStorage.setItem("fcmRegistrationToken", currentToken)
				})
				.catch((err) => {
					if (!this.permissionService.areNotificationsGranted()) {
						this.matSnackBar.open("Please enable the Notifications permission!", "Ok", {
							duration: 3000,
						})
					} else {
						console.error(err)
						this.matSnackBar.open("An Error Occured while subscribing to notifications", "Ok", {
							duration: 3000,
						})
					}
					this.areChatNotificationsReady = false
					localStorage.removeItem("fcmRegistrationToken")
				})
		})
	}

	protected sendMessage(user: string, message: string) {
		this.signalRService
			.sendMessage(user, message)
			.pipe(
				takeUntil(this.destroyed),
				switchMap(() => {
					// TODO Setup an event base architecture in the backend for this
					return this.notificationService.sendToEveryone({
						title: user,
						body: message,
					} as Notification)
				})
			)
			.subscribe()
	}

	protected getUsername() {
		return localStorage.getItem("userName")
	}

	ngOnDestroy() {
		this.destroyed.next()
		this.destroyed.complete()
	}
}
