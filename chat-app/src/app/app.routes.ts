import { Routes } from "@angular/router"
import { ChatComponent } from "./features/chat/chat.component"

export const routes: Routes = [
	{
		path: "",
		component: ChatComponent,
		title: "Chat",
	},
	{
		path: "**",
		redirectTo: "",
	},
]
