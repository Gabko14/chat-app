import { Component, EventEmitter, Output } from "@angular/core"
import { CdkTextareaAutosize } from "@angular/cdk/text-field"
import { MatButton } from "@angular/material/button"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

@Component({
	selector: "app-message-input",
	standalone: true,
	imports: [CdkTextareaAutosize, MatButton, ReactiveFormsModule, FormsModule],
	template: `
    <div class="input-messages fixed bottom-0 w-full h-fit flex justify-between items-center bg-neutral-800 px-3 py-1">
          <textarea
            #textarea
            class="message-input bg-neutral-800 flex-grow text-white outline-none hover:bg-[#303030] p-2 resize-none max-h-40 min-h-11 box-border leading-7 rounded"
            type="text"
            rows="1"
            placeholder="Enter your message here"
            cdkTextareaAutosize
            required
            [(ngModel)]="userInputMessage"></textarea>
      <button
        mat-button
        color="accent"
        class="text-white"
        [disabled]="userInputMessage === ''"
        (click)="sendMessage()">
        Send
      </button>
    </div>
  `,
	styles: `

	`,
})
export class MessageInputComponent {
	protected userInputMessage: string = ""
	@Output() send: EventEmitter<string> = new EventEmitter<string>()

	sendMessage() {
		this.send.emit(this.userInputMessage)
		this.userInputMessage = ""
	}
}
