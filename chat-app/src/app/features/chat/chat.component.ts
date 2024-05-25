import {CommonModule} from '@angular/common';
import {ChatService} from "./chat.service";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Message} from "./message";
import {DialogSetUsernameComponent} from "./dialog-set-username.component";
import {NotificationService} from "../../shared/notification.service";
import {MatButton} from "@angular/material/button";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {Subject, takeUntil} from "rxjs";
import {getToken, Messaging} from "@angular/fire/messaging";
import {PermissionService} from "../../shared/permission.service";

@Component({
  selector: 'app-chat',
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
  styles: [``],
  imports: [CommonModule, FormsModule, MatButton, MatSnackBarModule],
})

export class ChatComponent implements OnInit, OnDestroy {

  protected messages: Message[] = [];
  protected userInputMessage: string = '';

  private destroy$ = new Subject<void>();

  protected areChatNotificationsReady: boolean = this.permissionService.areNotificationsGranted() && localStorage.getItem("fcmRegistrationToken") != null;

  constructor(private dialog: MatDialog,
              private signalRService: ChatService,
              private notificationService: NotificationService,
              private messaging: Messaging,
              private matSnackBar: MatSnackBar,
              private permissionService: PermissionService) {
  }

  ngOnInit() {
    this.signalRService.getAllMessages().pipe(takeUntil(this.destroy$)).subscribe((messages) => {
      this.messages = messages
    })

    this.signalRService.startConnection().then(() => {
      this.signalRService.receiveMessage((user, message) => {
        this.messages.push({sender: user, content: message});
      });
    });

    if (localStorage.getItem('userName') === null) {
      const dialogRef = this.dialog.open(DialogSetUsernameComponent, {
        data: {newUsername: ""},
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((newMessage) => {
        if (newMessage) {
          localStorage.setItem('userName', newMessage);
        }
      });
    }
  }

  protected subscribeToNotifications() {
    navigator.serviceWorker.getRegistration(
      "./ngsw-worker.js"
    ).then(
      (registration) => {
        getToken(this.messaging,
          {
            vapidKey: "BM2criD6hTHh6lIBOBhMeFwJd_2mH25gPgeB89Zt5naafhPrdfiA3T7VoXWDNDExLnWvHP47kbEPIx_u5CBh5b0",// Get your own vapid key
            serviceWorkerRegistration: registration
          }
        ).then(
          (currentToken) => {
            this.notificationService.addPushSubscriber(currentToken)
              .pipe(takeUntil(this.destroy$))
              .subscribe()
            this.matSnackBar.open("You subscribed to Notifications!", "Ok", {duration: 2000})
            this.areChatNotificationsReady = true;
            localStorage.setItem("fcmRegistrationToken", currentToken);
          })
          .catch((err) => {
            if (!this.permissionService.areNotificationsGranted()) {
              this.matSnackBar.open("Please enable the Notifications permission!", "Ok", {duration: 3000})
            } else {
              console.error(err)
              this.matSnackBar.open("An Error Occured while subscribing to notifications", "Ok", {duration: 3000})
            }
            this.areChatNotificationsReady = false
            localStorage.removeItem("fcmRegistrationToken");
          });
      }
    );
  }


  protected sendMessage(user: string, message: string) {
    this.signalRService.sendMessage(user, message).then(() => {
      this.notificationService.sendToEveryone({
          title: user,
          body: message
        } as Notification
      ).pipe(takeUntil(this.destroy$)).subscribe();
    });
  }

  protected getUsername() {
    return localStorage.getItem("userName")
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
