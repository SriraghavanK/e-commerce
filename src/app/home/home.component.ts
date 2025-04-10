import { Component,  ElementRef, ViewChild } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { RouterLink, RouterLinkActive } from "@angular/router"
import { FooterComponent } from "../footer/footer.component"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { CartService } from "../services/cart.service"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FooterComponent, CommonModule, FormsModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css", "../app.component.css"],
})
export class HomeComponent {
  @ViewChild("mobileSection") mobileSection!: ElementRef
  @ViewChild("laptopSection") laptopSection!: ElementRef

  email = ""

  trendingProducts = [
    {
      id: 1,
      name: "Samsung S24 Ultra",
      price: 99999.99,
      image: "https://shorturl.at/IY9tM",
      badge: { text: "HOT", class: "bg-danger" },
    },
    {
      id: 2,
      name: "iPhone 16 Pro Max",
      price: 109999.99,
      image: "https://shorturl.at/keVMd",
      badge: { text: "NEW", class: "bg-primary" },
    },
    {
      id: 3,
      name: "ROG Strix SCAR 18",
      price: 209999.99,
      image: "https://shorturl.at/ZkMTs",
      badge: null,
    },
    {
      id: 4,
      name: "MacBook Pro",
      price: 159999.99,
      image: "https://shorturl.at/jdmjh",
      badge: { text: "SALE", class: "bg-success" },
    },
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === "mobile") {
        this.scrollToSection(this.mobileSection)
      } else if (fragment === "laptop") {
        this.scrollToSection(this.laptopSection)
      }
    })
  }

  scrollToSection(section: ElementRef) {
    section.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  addToCart(product: any) {
    const cartProduct = {
      id: product.id,
      title: product.name, // Convert 'name' to 'title' as expected by CartService
      price: product.price,
      image: product.image,
      quantity: 1,
      // Add optional properties that might be used elsewhere
      category: product.category || "",
      brand: product.brand || "",
      rating: product.rating || 0,
    }

    this.cartService.addToCart(cartProduct)
    this.router.navigate(["/cart"])
  }

  onSubscribe() {
    // Implement newsletter subscription logic here
    console.log("Subscribed with email:", this.email)
    // Reset the email input
    this.email = ""
  }
}

