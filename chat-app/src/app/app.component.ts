import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet],
	template: `
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  `,
	styles: `

  `,
})
export class AppComponent {}
