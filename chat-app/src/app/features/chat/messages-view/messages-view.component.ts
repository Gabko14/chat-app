import { Component, effect, input } from "@angular/core"
import { NgForOf } from "@angular/common"
import { Message } from "../message.type"
import { MessageComponent } from "./message.component"
import { AuthService } from "../../auth/auth.service"

@Component({
	selector: "app-messages-view",
	standalone: true,
	imports: [NgForOf, MessageComponent],
	template: `
      <article class="pb-20 overflow-auto max-h-fit px-5 flex flex-col gap-2">
        @for (message of messages(); track message) {
          <app-message [isMessageFromCurrentUser]="this.authSercice.getUsername() === message.sender" [message]="message"></app-message>
        }
      </article>
    `,
	styles: ``,
})
export class MessagesViewComponent {
	messages = input.required<Message[]>()

	constructor(protected readonly authSercice: AuthService) {
		effect(() => {
			this.messages()
			this.scrollChatToBottom()
		})
	}

	scrollChatToBottom() {
		window.scrollTo(0, document.body.scrollHeight)
	}

	protected readonly localStorage = localStorage
}
