import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface Order {
  id: string
  date: Date
  items: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  paymentMethod: string
  shippingAddress?: any
  trackingNumber?: string
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([])
  orders$ = this.ordersSubject.asObservable()

  constructor() {
    // Initialize with sample orders
    this.initializeOrders()
  }

  private initializeOrders() {
    const sampleOrders: Order[] = [
      {
        id: "TM-123456",
        date: new Date(2023, 10, 15), // November 15, 2023
        items: [
          {
            id: 1,
            title: "Samsung S24 Ultra",
            price: 99999.99,
            image: "https://shorturl.at/IY9tM",
            quantity: 1,
          },
          {
            id: 8,
            title: "MacBook Pro",
            price: 159999.99,
            image: "https://shorturl.at/jdmjh",
            quantity: 1,
          },
        ],
        subtotal: 259999.98,
        shipping: 0,
        tax: 20800.0,
        total: 280799.98,
        status: "Delivered",
        paymentMethod: "credit",
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "555-123-4567",
        },
        trackingNumber: "TRK7654321",
      },
      {
        id: "TM-123457",
        date: new Date(2023, 11, 5), // December 5, 2023
        items: [
          {
            id: 3,
            title: "iPhone 16 Pro Max",
            price: 109999.99,
            image: "https://shorturl.at/keVMd",
            quantity: 1,
          },
        ],
        subtotal: 109999.99,
        shipping: 0,
        tax: 8800.0,
        total: 118799.99,
        status: "Shipped",
        paymentMethod: "paypal",
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "555-123-4567",
        },
        trackingNumber: "TRK7654322",
      },
      {
        id: "TM-123458",
        date: new Date(2023, 11, 20), // December 20, 2023
        items: [
          {
            id: 7,
            title: "Redmagic 10 Pro",
            price: 69999.99,
            image: "https://shorturl.at/MgUxK",
            quantity: 1,
          },
        ],
        subtotal: 69999.99,
        shipping: 10,
        tax: 5600.0,
        total: 75609.99,
        status: "Processing",
        paymentMethod: "credit",
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "555-123-4567",
        },
      },
      {
        id: "TM-123459",
        date: new Date(2023, 9, 10), // October 10, 2023
        items: [
          {
            id: 14,
            title: "ROG Strix SCAR 18",
            price: 209999.99,
            image: "https://shorturl.at/ZkMTs",
            quantity: 1,
          },
        ],
        subtotal: 209999.99,
        shipping: 0,
        tax: 16800.0,
        total: 226799.99,
        status: "Cancelled",
        paymentMethod: "credit",
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          phone: "555-123-4567",
        },
      },
    ]

    this.ordersSubject.next(sampleOrders)
  }

  addOrder(order: Order) {
    const currentOrders = this.ordersSubject.value
    this.ordersSubject.next([order, ...currentOrders])
  }

  cancelOrder(orderId: string) {
    const currentOrders = this.ordersSubject.value
    const updatedOrders = currentOrders.map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order,
    )
    this.ordersSubject.next(updatedOrders)
  }

  getOrderById(orderId: string): Order | undefined {
    return this.ordersSubject.value.find((order) => order.id === orderId)
  }
}

