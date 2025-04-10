import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

// Update the CartItem interface to be more flexible with optional properties
export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
  category?: string
  brand?: string
  rating?: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([])
  cartItems$ = this.cartItemsSubject.asObservable()

  constructor() {
    if (typeof window !== "undefined" && window.localStorage) { 
      // Ensure it's running in the browser
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      }
    }
  }


  // Update the addToCart method to handle both name and title properties
  addToCart(product: any) {
    const currentItems = this.cartItemsSubject.value
    const existingItemIndex = currentItems.findIndex((item) => item.id === product.id)

    // Handle products that might have name instead of title
    const productTitle = product.title || product.name

    if (existingItemIndex !== -1) {
      // Item already exists, increase quantity
      const updatedItems = [...currentItems]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + (product.quantity || 1),
      }
      this.cartItemsSubject.next(updatedItems)
    } else {
      // Add new item
      const newItem: CartItem = {
        id: product.id,
        title: productTitle,
        price: product.price,
        image: product.image,
        category: product.category || "",
        brand: product.brand || "",
        rating: product.rating || 0,
        quantity: product.quantity || 1,
      }
      this.cartItemsSubject.next([...currentItems, newItem])
    }

    // Save to localStorage
    this.saveCart()
  }

  removeFromCart(itemId: number) {
    const currentItems = this.cartItemsSubject.value
    const updatedItems = currentItems.filter((item) => item.id !== itemId)
    this.cartItemsSubject.next(updatedItems)
    this.saveCart()
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId)
      return
    }

    const currentItems = this.cartItemsSubject.value
    const updatedItems = currentItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    this.cartItemsSubject.next(updatedItems)
    this.saveCart()
  }

  clearCart() {
    this.cartItemsSubject.next([])
    localStorage.removeItem("cart")
  }

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  get cartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  private saveCart() {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("cart", JSON.stringify(this.cartItemsSubject.value));
    }
  }
}

