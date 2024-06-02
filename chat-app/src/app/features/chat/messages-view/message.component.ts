import { Component, HostBinding, input } from "@angular/core"
import { NgForOf } from "@angular/common"
import { Message } from "../message.type"

@Component({
	selector: "app-message",
	standalone: true,
	imports: [NgForOf],
	template: `
    @if (isMessageFromCurrentUser()) {
      <div class="bg-emerald-200 p-4 max-w-3/5 break-words rounded">
        <p>{{ message().content }}</p>
      </div>
    } @else {
      <div class="bg-gray-200 p-4 max-w-3/5 break-words rounded">
        <strong>{{ message().sender }}</strong>
        <p>{{ message().content }}</p>
      </div>
    }
  `,
	styles: `
    :host {
      display: flex;
    }
  `,
})
export class MessageComponent {
	message = input.required<Message>()
	isMessageFromCurrentUser = input.required<boolean>()

	@HostBinding("style.flex-direction")
	get ifMessageFromUserAlign() {
		return this.isMessageFromCurrentUser() ? "row-reverse" : "row"
	}
}
