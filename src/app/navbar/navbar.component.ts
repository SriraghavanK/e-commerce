import { Component,  OnInit, Inject,  Renderer2 } from "@angular/core"
import { RouterLink,  Router } from "@angular/router"
import { CommonModule, DOCUMENT } from "@angular/common"
import  { CartService } from "../services/cart.service"
import  { AuthService } from "../services/auth.service"

@Component({
  selector: "app-navbar",
  imports: [RouterLink, CommonModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0
  isDesktop = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private renderer: Renderer2,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Add event listeners for offcanvas
    const offcanvas = this.document.getElementById("offcanvasLeft")
    const contentWrapper = this.document.querySelector(".content-wrapper")
    const navbar = this.document.querySelector(".navbar")

    // Check if screen is desktop size
    const checkScreenSize = () => {
      this.isDesktop = window.innerWidth >= 992
    }

    // Initial check
    checkScreenSize()

    // Get offcanvas width based on screen size
    const getOffcanvasWidth = () => {
      return window.innerWidth <= 576 ? "280px" : "300px"
    }

    // Update shift on window resize
    window.addEventListener("resize", () => {
      checkScreenSize()
      if (offcanvas?.classList.contains("show") && this.isDesktop) {
        const width = getOffcanvasWidth()
        this.renderer.setStyle(contentWrapper, "margin-left", width)
        this.renderer.setStyle(navbar, "left", width)
        this.renderer.setStyle(navbar, "width", `calc(100% - ${width})`)
      } else {
        // Reset styles on mobile
        this.renderer.setStyle(contentWrapper, "margin-left", "0")
        this.renderer.setStyle(navbar, "left", "0")
        this.renderer.setStyle(navbar, "width", "100%")
      }
    })

    // Add show.bs.offcanvas event listener
    offcanvas?.addEventListener("show.bs.offcanvas", () => {
      if (this.isDesktop) {
        const width = getOffcanvasWidth()

        if (contentWrapper) {
          this.renderer.setStyle(contentWrapper, "margin-left", width)
        }

        // if (navbar) {
        //   this.renderer.setStyle(navbar, "left", width)
        //   this.renderer.setStyle(navbar, "width", `calc(100% - ${width})`)
        // }
      }

      // Prevent body scrolling when offcanvas is open
      this.renderer.addClass(this.document.body, "offcanvas-open")
    })

    // Add hide.bs.offcanvas event listener
    offcanvas?.addEventListener("hide.bs.offcanvas", () => {
      if (this.isDesktop) {
        if (contentWrapper) {
          this.renderer.setStyle(contentWrapper, "margin-left", "0")
        }

        if (navbar) {
          this.renderer.setStyle(navbar, "left", "0")
          this.renderer.setStyle(navbar, "width", "100%")
        }
      }

      // Re-enable body scrolling
      this.renderer.removeClass(this.document.body, "offcanvas-open")
    })

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0)
    })
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  navigateToSection(sectionId: string) {
    this.router.navigate([], { fragment: sectionId })
  }

  logout() {
    this.authService.logout()
  }
  onOffcanvasShow() {
    console.log("Offcanvas opened!")
  }

  onOffcanvasHide() {
    console.log("Offcanvas closed!")
  }
}

