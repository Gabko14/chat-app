import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ChatService} from "./services/chat.service";
import {FormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Message} from "./models/message";
import {DialogSetUsernameComponent} from "./components/dialog-set-username.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  template: `
    <section class="">
      <article class="pb-10">
        <div *ngFor="let message of messages">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </article>
      <input [(ngModel)]="message" type="text" placeholder="Enter message"/>
      <button (click)="sendMessage(localStorage.getItem('userName') ?? 'Guest', this.message)">Send</button>
    </section>
  `,
  styles: [``],
  imports: [CommonModule, FormsModule],
})

export class ChatComponent implements OnInit {
  messages: Message[] = [];
  message: string = '';
  userName?: string = undefined;

  constructor(private store: Store, private dialog: MatDialog, private signalRService: ChatService) {
  }

  ngOnInit() {
    this.signalRService.getAllMessages().subscribe((messages) => {
      this.messages = messages
    })

    this.signalRService.startConnection().then(() => {
      this.signalRService.receiveMessage((user, message) => {
        this.messages.push({sender: user, content: message});
      });
    });

    if (localStorage.getItem('userName') === null) {
      const dialogRef = this.dialog.open(DialogSetUsernameComponent, {
        data: {newUsername: this.userName},
      });

      dialogRef.afterClosed().subscribe((newMessage) => {
        if (newMessage) {
          localStorage.setItem('userName', newMessage);
        }
      });
    }
  }

  sendMessage(user: string, message: string) {
    this.signalRService.sendMessage(user, message);
  }

  protected readonly localStorage = localStorage;
}
