import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import  { CartService, CartItem } from "../services/cart.service"

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items
    })
  }
  updateQuantity(item: any, quantity: number | Event) {
    if (quantity instanceof Event) {
      const inputElement = quantity.target as HTMLInputElement;
      quantity = Number(inputElement.value);
    }
    
    if (!isNaN(quantity) && quantity >= 1) {
      item.quantity = quantity;
    }
  }
  

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId)
  }

  clearCart() {
    this.cartService.clearCart()
  }

  get cartTotal(): number {
    return this.cartService.cartTotal
  }

  get cartItemCount(): number {
    return this.cartService.cartItemCount
  }

  get shippingCost(): number {
    return this.cartTotal > 0 ? (this.cartTotal > 1000 ? 0 : 10) : 0
  }

  get taxAmount(): number {
    return this.cartTotal * 0.08 // 8% tax
  }

  get orderTotal(): number {
    return this.cartTotal + this.shippingCost + this.taxAmount
  }
}

