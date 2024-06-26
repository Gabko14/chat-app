import { Injectable, OnDestroy } from "@angular/core"
import { DialogSetUsernameComponent } from "./dialog-set-username.component"
import { ReplaySubject, takeUntil } from "rxjs"
import { MatDialog } from "@angular/material/dialog"

@Injectable({
	providedIn: "root",
})
export class AuthService implements OnDestroy {
	private readonly destroyed = new ReplaySubject<void>()

	constructor(private readonly dialog: MatDialog) {}

	public login() {
		if (localStorage.getItem("userName") === null) {
			const dialogRef = this.dialog.open(DialogSetUsernameComponent, {
				data: { newUsername: "" },
			})

			dialogRef
				.afterClosed()
				.pipe(takeUntil(this.destroyed))
				.subscribe((newMessage) => {
					if (newMessage) {
						localStorage.setItem("userName", newMessage)
					}
				})
		}
	}

	public getUsername() {
		return localStorage.getItem("userName")
	}

	ngOnDestroy() {
		this.destroyed.next()
		this.destroyed.complete()
	}
}
