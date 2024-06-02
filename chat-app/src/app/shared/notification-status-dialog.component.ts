import { Component, Inject } from "@angular/core"
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { NotificationService } from "./notification.service"
import { NgClass, NgStyle } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"

@Component({
	selector: "app-notification-status-dialog",
	standalone: true,
	template: `
      <h2 mat-dialog-title>Notification Status</h2>
      <mat-dialog-content>
        <div class="flex items-baseline gap-6">
          <p class="flex-grow">Notifications Permission Granted:</p>
          @if (dialogData.areNotificationsGranted) {
            <strong class="text-xl text-green-500">{{ dialogData.areNotificationsGranted }}</strong>
          } @else {
            <strong class="text-xl text-red-500">{{ dialogData.areNotificationsGranted }}</strong>
          }
        </div>
        <br>
        <div class="flex items-baseline gap-6">
          <p class="flex-grow">Subscribed to Notifications:</p>
          @if (dialogData.isUserSubscribedToFcmNotifications) {
            <strong class="text-xl text-green-500">{{ dialogData.isUserSubscribedToFcmNotifications }}</strong>
          } @else {
            <strong class="text-xl text-red-500">{{ dialogData.isUserSubscribedToFcmNotifications }}</strong>
          }
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="flex justify-end">
        @if (!dialogData.isUserSubscribedToFcmNotifications || !dialogData.areNotificationsGranted) {
          <button mat-button (click)="this.notificationService.subscribeToNotifications()">Subscribe to Notifications
          </button>
        }
        <button mat-button cdkFocusInitial (click)="closeDialog()">Close</button>
      </mat-dialog-actions>
    `,
	styles: `
  `,
	imports: [
		MatButtonModule,
		MatDialogActions,
		MatDialogClose,
		MatDialogTitle,
		MatDialogContent,
		NgClass,
		NgStyle,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
	],
})
export class NotificationStatusDialogComponent {
	constructor(
		private readonly dialogRef: MatDialogRef<NotificationStatusDialogComponent>,
		protected readonly notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA)
		public dialogData: {
			areNotificationsGranted: boolean
			isUserSubscribedToFcmNotifications: boolean
		}
	) {}

	closeDialog(): void {
		this.dialogRef.close()
	}
}
