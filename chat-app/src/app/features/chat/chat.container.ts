import { CommonModule } from "@angular/common"
import { ChatService } from "./chat.service"
import { FormsModule } from "@angular/forms"
import { Message } from "./message.type"
import { NotificationService } from "../../shared/notification.service"
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from "@angular/material/button"
import { Component, OnDestroy, OnInit, signal } from "@angular/core"
import { filter, map, mergeMap, ReplaySubject, switchMap, takeUntil, window } from "rxjs"
import { PermissionService } from "../../shared/permission.service"
import { AuthService } from "../auth/auth.service"
import { MatIcon } from "@angular/material/icon"
import { SwPush, SwUpdate, VersionReadyEvent } from "@angular/service-worker"
import { NotificationStatusDialogComponent } from "../../shared/notification-status-dialog.component"
import { MatDialog } from "@angular/material/dialog"
import { MatInput } from "@angular/material/input"
import { CdkTextareaAutosize } from "@angular/cdk/text-field"
import { MessageInputComponent } from "./message-input/message-input.component"
import { MessagesViewComponent } from "./messages-view/messages-view.component"

@Component({
	selector: "app-chat",
	standalone: true,
	template: `
    <header class="flex justify-between gap-2 p-2 sticky top-0 w-full bg-white max-h-fit">
      <strong class="content-center text-2xl">ChatApp</strong>
			<button mat-raised-button (click)="localStorage.removeItem('fcmRegistrationToken')">Reset subscription</button>
      <div class="flex items-center gap-2">
        @if (newestVersionAvailable) {
          <button mat-icon-button class="hover:bg-blue-500 hover:bg-opacity-10" (click)="updateToNewestVersion()">
            <mat-icon class="text-blue-500">trending_up</mat-icon>
          </button>
        }
        @if (this.notificationService.areChatNotificationsReady$ | async) {
          <button mat-icon-button class="hover:bg-green-800 hover:bg-opacity-10" (click)="showNotificationStatus()">
            <mat-icon class="text-green-800">notifications_active</mat-icon>
          </button>
        } @else {
          <button mat-icon-button class="hover:bg-red-800 hover:bg-opacity-10" (click)="showNotificationStatus()">
            <mat-icon class="text-red-800">notifications_off</mat-icon>
          </button>
        }
      </div>
    </header>
    <section class="chat">
      <app-messages-view [messages]="messages()"></app-messages-view>
      <app-message-input
        (send)="sendMessage(this.authSercice.getUsername() ?? 'Guest', $event)"></app-message-input>
    </section>
  `,
	styles: [``],
	imports: [
		CommonModule,
		FormsModule,
		MatButton,
		MatIcon,
		MatMiniFabButton,
		MatFabButton,
		MatInput,
		CdkTextareaAutosize,
		MessageInputComponent,
		MessagesViewComponent,
		MatIconButton,
	],
})
export class ChatContainer implements OnInit, OnDestroy {
	protected messages = signal<Message[]>([])
	private readonly destroyed = new ReplaySubject<void>()
	protected newestVersionAvailable?: VersionReadyEvent

	constructor(
		private readonly signalRService: ChatService,
		protected readonly notificationService: NotificationService,
		private readonly permissionService: PermissionService,
		protected readonly authSercice: AuthService,
		private readonly swUpdate: SwUpdate,
		protected readonly swPush: SwPush,
		private readonly dialog: MatDialog
	) {
		// TODO Header & update logic verlagern
		this.swUpdate.versionUpdates
			.pipe(filter((evt): evt is VersionReadyEvent => evt.type === "VERSION_READY"))
			.subscribe((evt) => {
				this.newestVersionAvailable = evt
			})
	}

	ngOnInit() {
		this.initializeChat()
		this.authSercice.login()
	}

	// TODO remove
	protected isPushNotificationSupported() {
		return "serviceWorker" in navigator && "PushManager" in window
	}

	private initializeChat() {
		this.signalRService
			.getAllMessages()
			.pipe(takeUntil(this.destroyed))
			.subscribe((messages) => {
				this.messages.set(messages)
			})

		this.signalRService
			.startConnection()
			.pipe(
				takeUntil(this.destroyed),
				mergeMap(() => {
					return this.signalRService.receiveMessage().pipe(
						map((message) => {
							this.messages.update((messages) => [...messages, message])
						})
					)
				})
			)
			.subscribe()
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

	protected updateToNewestVersion() {
		document.location.reload()
		// TODO can this contain version data? If not => make a bool out of this
		this.newestVersionAvailable = undefined
	}

	protected showNotificationStatus() {
		this.dialog.open(NotificationStatusDialogComponent, {
			data: {
				areNotificationsGranted: this.permissionService.areNotificationsGranted(),
				isUserSubscribedToFcmNotifications:
					this.notificationService.isUserSubscribedToNotifications(),
			},
		})
	}

	ngOnDestroy() {
		this.destroyed.next()
		this.destroyed.complete()
	}

	protected readonly navigator = navigator
	protected readonly window = window
	protected readonly localStorage = localStorage
}
