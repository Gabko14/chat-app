import { Injectable } from "@angular/core"
import { MatSnackBar } from "@angular/material/snack-bar"

@Injectable({
	providedIn: "root",
})
export class HttpErrorHandlerService {
	constructor(private readonly matSnackBar: MatSnackBar) {}

	public handleHttpError(message: string = "A Server Error Occurred"): void {
		this.matSnackBar.open(message, "Ok", { duration: 3000 })
	}
}
