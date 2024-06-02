import { Routes } from "@angular/router"
import { ChatContainer } from "./features/chat/chat.container"

export const routes: Routes = [
	{
		path: "",
		component: ChatContainer,
		title: "Chat",
	},
	{
		path: "**",
		redirectTo: "",
	},
]
