import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import  { OrderService, Order } from "../services/order.service"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []
  filteredOrders: Order[] = []
  selectedOrder: Order | null = null

  // Filter options
  statusFilter = "all"
  sortOption = "date-desc"
  searchQuery = ""

  // Pagination
  currentPage = 1
  itemsPerPage = 5
  totalPages = 1

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.orders$.subscribe((orders) => {
      this.orders = orders
      this.applyFilters()
    })
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order
    // Scroll to top of modal
    setTimeout(() => {
      const modalContent = document.querySelector(".order-details-content")
      if (modalContent) {
        modalContent.scrollTop = 0
      }
    }, 100)
  }

  closeOrderDetails() {
    this.selectedOrder = null
  }

  applyFilters() {
    // First apply status filter
    let result = [...this.orders]

    if (this.statusFilter !== "all") {
      result = result.filter((order) => order.status.toLowerCase() === this.statusFilter)
    }

    // Then apply search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => (item.name || item.title || "").toLowerCase().includes(query)),
      )
    }

    // Finally sort
    switch (this.sortOption) {
      case "date-desc":
        result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "date-asc":
        result = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "total-desc":
        result = result.sort((a, b) => b.total - a.total)
        break
      case "total-asc":
        result = result.sort((a, b) => a.total - b.total)
        break
    }

    this.filteredOrders = result
    this.calculateTotalPages()
    this.applyPagination()
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage)
  }

  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.filteredOrders = this.filteredOrders.slice(startIndex, endIndex)
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return
    }
    this.currentPage = page
    this.applyFilters()
  }

  onFilterChange() {
    this.currentPage = 1 // Reset to first page when filters change
    this.applyFilters()
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "processing":
        return "status-processing"
      case "shipped":
        return "status-shipped"
      case "delivered":
        return "status-delivered"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  cancelOrder(order: Order) {
    if (confirm("Are you sure you want to cancel this order?")) {
      this.orderService.cancelOrder(order.id)
      if (this.selectedOrder && this.selectedOrder.id === order.id) {
        this.selectedOrder = this.orders.find((o) => o.id === order.id) || null
      }
    }
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  getOrderStatusTimeline(status: string): number {
    switch (status.toLowerCase()) {
      case "processing":
        return 1
      case "shipped":
        return 2
      case "delivered":
        return 3
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  addDays(date: Date | string, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  // Helper method to generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = []
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Method to download invoice
  downloadInvoice(order: Order) {
    // This would typically generate a PDF invoice
    alert(`Invoice for order ${order.id} is being downloaded...`)
  }

  // Method to request return
  requestReturn(order: Order) {
    if (confirm(`Are you sure you want to request a return for order ${order.id}?`)) {
      alert("Return request submitted successfully!")
    }
  }
}

