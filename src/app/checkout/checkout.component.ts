import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterLink } from "@angular/router"
import { CartService } from "../services/cart.service"
import {FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { OrderService } from "../services/order.service"
import  { Router } from "@angular/router"

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  currentStep = 1
  paymentMethod = "credit"
  orderPlaced = false
  processingPayment = false
  orderId = ""

  // Google Pay state
  googlePayLoaded = false
  googlePayButtonClicked = false

  // Form groups
  shippingForm: FormGroup
  paymentForm: FormGroup

  // Card types
  cardTypes = [
    { name: "Visa", icon: "fa-cc-visa" },
    { name: "MasterCard", icon: "fa-cc-mastercard" },
    { name: "American Express", icon: "fa-cc-amex" },
    { name: "Discover", icon: "fa-cc-discover" },
  ]

  // Months and years for card expiration
  months = Array.from({ length: 12 }, (_, i) => i + 1)
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)

  // Saved addresses
  savedAddresses = [
    {
      id: 1,
      name: "Home",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "555-123-4567",
      email: "john.doe@example.com",
      isDefault: true,
    },
    {
      id: 2,
      name: "Work",
      firstName: "John",
      lastName: "Doe",
      address: "456 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      country: "United States",
      phone: "555-987-6543",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ]

  // Saved payment methods
  savedPaymentMethods = [
    {
      id: 1,
      type: "credit",
      name: "Visa ending in 4242",
      cardName: "John Doe",
      cardNumber: "************4242",
      cardExpMonth: 12,
      cardExpYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "paypal",
      name: "PayPal - john.doe@example.com",
      isDefault: false,
    },
  ]

  selectedSavedAddress: any = null
  selectedSavedPayment: any = null

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    // Initialize shipping form
    this.shippingForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      address: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      zipCode: ["", [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ["United States", [Validators.required]],
      saveAddress: [false],
    })

    // Initialize payment form
    this.paymentForm = this.fb.group({
      cardName: ["", [Validators.required]],
      cardNumber: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpMonth: ["", [Validators.required]],
      cardExpYear: ["", [Validators.required]],
      cardCvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      saveCard: [false],
    })
  }

  ngOnInit() {
    // Check if cart is empty, redirect if needed
    if (this.cartItemCount === 0) {
      this.router.navigate(["/cart"])
    }

    // Simulate loading Google Pay
    setTimeout(() => {
      this.googlePayLoaded = true
    }, 1500)
  }

  // Navigation methods
  nextStep() {
    if (this.currentStep === 1 && (this.shippingForm.valid || this.selectedSavedAddress)) {
      this.currentStep++
    } else if (
      this.currentStep === 2 &&
      ((this.paymentMethod === "credit" && (this.paymentForm.valid || this.selectedSavedPayment)) ||
        this.paymentMethod === "paypal" ||
        this.paymentMethod === "gpay")
    ) {
      this.currentStep++
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  // Payment method selection
  selectPaymentMethod(method: string) {
    this.paymentMethod = method
    this.selectedSavedPayment = null
  }

  // Select saved address
  selectAddress(address: any) {
    this.selectedSavedAddress = address

    // Populate form with selected address
    if (address) {
      this.shippingForm.patchValue({
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      })
    }
  }

  // Select saved payment method
  selectPaymentMethod2(payment: any) {
    this.selectedSavedPayment = payment
    this.paymentMethod = payment.type

    if (payment.type === "credit") {
      this.paymentForm.patchValue({
        cardName: payment.cardName,
        cardExpMonth: payment.cardExpMonth,
        cardExpYear: payment.cardExpYear,
      })
    }
  }

  // Google Pay button click
  initiateGooglePay() {
    this.googlePayButtonClicked = true

    // Simulate Google Pay processing
    setTimeout(() => {
      this.googlePayButtonClicked = false
      this.nextStep()
    }, 2000)
  }

  // Place order
  placeOrder() {
    this.processingPayment = true

    // Create order object
    const order = {
      id: "TM-" + Math.floor(Math.random() * 1000000),
      date: new Date(),
      items: this.cartItems,
      subtotal: this.cartTotal,
      shipping: this.shippingCost,
      tax: this.taxAmount,
      total: this.orderTotal,
      status: "Processing",
      paymentMethod: this.paymentMethod,
      shippingAddress: this.selectedSavedAddress || this.shippingForm.value,
      trackingNumber: "TRK" + Math.floor(Math.random() * 10000000),
    }

    // Simulate payment processing and order creation
    setTimeout(() => {
      this.processingPayment = false
      this.orderPlaced = true
      this.orderId = order.id

      // Save order to order service
      this.orderService.addOrder(order)

      // Clear cart
      this.cartService.clearCart()
    }, 2000)
  }

  // Getters for cart data
  get cartItems() {
    return this.cartService.cartItems
  }

  get cartItemCount() {
    return this.cartService.cartItemCount
  }

  get cartTotal() {
    return this.cartService.cartTotal
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

  // Form validation helpers
  isFieldInvalid(form: FormGroup, field: string) {
    return form.get(field)?.invalid && (form.get(field)?.dirty || form.get(field)?.touched)
  }

  getCardIcon() {
    const cardNumber = this.paymentForm.get("cardNumber")?.value || ""
    if (cardNumber.startsWith("4")) return "fa-cc-visa"
    if (cardNumber.startsWith("5")) return "fa-cc-mastercard"
    if (cardNumber.startsWith("3")) return "fa-cc-amex"
    if (cardNumber.startsWith("6")) return "fa-cc-discover"
    return "fa-credit-card"
  }

  // Format card number for display
  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) return ""
    return cardNumber.replace(/(\d{4})/g, "$1 ").trim()
  }
}

