import { Component, OnInit,Renderer2 , Inject } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { LoginpageComponent } from "./loginpage/loginpage.component"
import { HomeComponent } from "./home/home.component"
import { AboutComponent } from "./about/about.component"
import { ContactComponent } from "./contact/contact.component"
import { NavbarComponent } from "./navbar/navbar.component"
import { FooterComponent } from "./footer/footer.component"
import { CommonModule, DOCUMENT } from "@angular/common"
import { AuthService } from "./services/auth.service"


@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    LoginpageComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2 , @Inject(DOCUMENT) private document: Document ,public authService: AuthService) {}
  title = "tech-mart"
  isLoggedIn = false


  ngOnInit() {
    // We'll set up the event listeners after the view is initialized
    setTimeout(() => {
      this.setupOffcanvasListeners()
    }, 0)
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
    })
  }

  setupOffcanvasListeners() {
    const offcanvas = this.document.getElementById("offcanvasLeft")
    const mainContent = this.document.getElementById("main-content")

    if (offcanvas && mainContent) {
      // Use the correct Bootstrap 5 events
      offcanvas.addEventListener("show.bs.offcanvas", () => {
        this.renderer.addClass(mainContent, "move-right")
      })

      offcanvas.addEventListener("hidden.bs.offcanvas", () => {
        this.renderer.removeClass(mainContent, "move-right")
      })
    }
  }
}

