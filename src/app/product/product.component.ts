import { CommonModule } from "@angular/common"
import { Component,  OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { CartService } from "../services/cart.service"

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class ProductComponent implements OnInit {
  // Filter and pagination state
  activeCategory = "all"
  activeBrand = "all"
  searchTerm = ""
  sortOption = "featured"
  currentPage = 1
  itemsPerPage = 8
  totalPages = 1

  // Products data
  allProducts: any[] = []
  filteredProducts: any[] = []

  // Math reference for template
  Math = Math

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    // Initialize with sample data (replace with your actual data service)
    this.initializeProducts()

    // Check for query parameters
    this.route.queryParams.subscribe((params) => {
      if (params["category"]) {
        this.activeCategory = params["category"]
      }

      if (params["brand"]) {
        this.activeBrand = params["brand"]
      }

      this.applyFilters()
    })
  }

  initializeProducts(): void {
    // Mobile products
    const samsungProducts = [
      {
        id: 1,
        title: "Samsung S24 Ultra",
        description:
          "The Samsung Galaxy S24 Ultra features a Dynamic AMOLED display, advanced camera, and Snapdragon 8 Gen 3 processor.",
        price: 99999.99,
        image: "https://shorturl.at/IY9tM",
        category: "mobile",
        brand: "samsung",
        rating: 4.5,
        badge: "Premium",
        quantity: 1,
      },
      {
        id: 2,
        title: "Samsung Galaxy Z Fold 5",
        description: "Foldable smartphone with large internal display and advanced multitasking capabilities.",
        price: 149999.99,
        image: "https://shorturl.at/z6WfN",
        category: "mobile",
        brand: "samsung",
        rating: 4.3,
        badge: "Foldable",
        quantity: 1,
      },
    ]

    const appleProducts = [
      {
        id: 3,
        title: "iPhone 16 Pro Max",
        description:
          "The iPhone 16 Pro Max has a 6.9-inch Super Retina XDR display, an advanced camera system, and long battery life.",
        price: 109999.99,
        image: "https://shorturl.at/keVMd",
        category: "mobile",
        brand: "apple",
        rating: 5.0,
        badge: "New",
        quantity: 1,
      },
      {
        id: 4,
        title: "iPhone 16",
        description: "The latest iPhone with A18 chip, improved cameras, and all-day battery life.",
        price: 79999.99,
        image: "https://shorturl.at/ZxPoO",
        category: "mobile",
        brand: "apple",
        rating: 4.7,
        quantity: 1,
      },
    ]

    const xiaomiProducts = [
      {
        id: 5,
        title: "Xiaomi 14 Ultra",
        description: "Flagship smartphone with Leica optics and powerful Snapdragon processor.",
        price: 82999.99,
        image: "https://shorturl.at/CFTPs",
        category: "mobile",
        brand: "xiaomi",
        rating: 4.4,
        badge: "Camera",
        quantity: 1,
      },
    ]

    const googleProducts = [
      {
        id: 6,
        title: "Google Pixel 9 Pro",
        description: "The latest Google Pixel with advanced AI features and exceptional camera quality.",
        price: 82999.99,
        image: "https://shorturl.at/RKvqx",
        category: "mobile",
        brand: "google",
        rating: 4.6,
        badge: "AI",
        quantity: 1,
      },
    ]

    const gamingPhones = [
      {
        id: 7,
        title: "Redmagic 10 Pro",
        description:
          "The Red Magic 10 Pro is a gaming smartphone with a Snapdragon 8 Elite processor, 144Hz AMOLED display, and advanced cooling.",
        price: 69999.99,
        image: "https://shorturl.at/MgUxK",
        category: "mobile",
        brand: "redmagic",
        rating: 4.0,
        badge: "Gaming",
        quantity: 1,
      },
    ]

    // Laptop products
    const appleLatops = [
      {
        id: 8,
        title: "MacBook Pro",
        description:
          "The MacBook Pro features high-performance processors, a stunning Retina display, and long battery life.",
        price: 159999.99,
        image: "https://shorturl.at/jdmjh",
        category: "laptop",
        brand: "apple",
        rating: 5.0,
        badge: "Premium",
        quantity: 1,
      },
      {
        id: 9,
        title: "MacBook Air",
        description: "Thin and light laptop with M3 chip and all-day battery life.",
        price: 89999.99,
        image: "https://imgs.search.brave.com/Z5aRJ5abTpH1UVrG0AeIUOATuQQA3xS3gVrL4LnrfGs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9naXpt/b2RvLmNvbS9hcHAv/dXBsb2Fkcy8yMDI0/LzA5L21iYS1tMi5q/cGc",
        category: "laptop",
        brand: "apple",
        rating: 4.8,
        quantity: 1,
      },
    ]

    const dellLaptops = [
      {
        id: 10,
        title: "Dell XPS 15",
        description: "Premium laptop with InfinityEdge display and powerful performance.",
        price: 139999.99,
        image: "https://imgs.search.brave.com/wYVlPtECkBuv-RI72dhO7HHI9THshRCOYYQOtZaVkQ8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFyc29BTm03dEwu/anBn",
        category: "laptop",
        brand: "dell",
        rating: 4.5,
        badge: "Premium",
        quantity: 1,
      },
    ]

    const hpLaptops = [
      {
        id: 11,
        title: "HP Spectre x360",
        description: "Convertible laptop with premium design and OLED display.",
        price: 119999.99,
        image: "https://imgs.search.brave.com/PmC_Ow_p6WduDngSlM3WUYoL7jev3G7-HhkAOI6t1iE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aHAuY29tL2NvbnRl/bnQvZGFtL3NpdGVz/L3dvcmxkd2lkZS9w/ZXJzb25hbC1jb21w/dXRlcnMvY29uc3Vt/ZXIvbGFwdG9wcy1h/bmQtMi1uLTFzL3Nw/ZWN0cmUvdmVyc2lv/bi0yMDIzL0hQJTIw/U3BlY3RyZSUyMHgz/NjAlMjAxNF9fTW9i/aWxlQDJ4LnBuZw",
        category: "laptop",
        brand: "hp",
        rating: 4.4,
        badge: "Convertible",
        quantity: 1,
      },
    ]

    const lenovoLaptops = [
      {
        id: 12,
        title: "Lenovo Ideapad Slim 5i",
        description:
          "The Lenovo IdeaPad Slim 5i is a budget-friendly laptop with a 16-inch display and great battery life.",
        price: 65999.99,
        image: "https://shorturl.at/gyzd8",
        category: "laptop",
        brand: "lenovo",
        rating: 4.2,
        badge: "Budget",
        quantity: 1,
      },
      {
        id: 13,
        title: "Lenovo Legion Pro 7i",
        description: "Powerful gaming laptop with high-refresh display and RGB keyboard.",
        price: 169999.99,
        image: "https://imgs.search.brave.com/cbq3tawt7Bz7y1URscf0m3f4abHitDwSwvuJwcdCTsA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/bGVub3ZvLWxlZ2lv/bi1wcm8tN2ktZ2Vu/LTEwLTE2LWludGVs/LXYwLWEybzU1OW9x/eGxiZTEucG5nP3dp/ZHRoPTcyMCZmb3Jt/YXQ9cG5nJmF1dG89/d2VicCZzPWE5NDc2/ZmJmNjEwODk0YmI5/ODM2MjlkMGZhOGZh/ZWQ3OWUwODM4ODI",
        category: "laptop",
        brand: "lenovo",
        rating: 4.6,
        badge: "Gaming",
        quantity: 1,
      },
    ]

    const gamingLaptops = [
      {
        id: 14,
        title: "ROG Strix SCAR 18",
        description:
          "The ROG Strix SCAR 18 is a powerful gaming laptop with a high-refresh-rate display and advanced cooling.",
        price: 209999.99,
        image: "https://shorturl.at/ZkMTs",
        category: "laptop",
        brand: "asus",
        rating: 4.7,
        badge: "Gaming",
        quantity: 1,
      },
    ]

    // Other electronics
    const tablets = [
      {
        id: 15,
        title: "iPad Pro",
        description: "Powerful tablet with M4 chip and Liquid Retina XDR display.",
        price: 99999.99,
        image: "https://shorturl.at/GuEwm",
        category: "otherelectronics",
        brand: "tablet",
        rating: 4.9,
        badge: "Premium",
        quantity: 1,
      },
      {
        id: 16,
        title: "Samsung Galaxy Tab S10 Ultra",
        description: "Large AMOLED display tablet with S Pen support and DeX mode.",
        price: 85999.99,
        image: "https://imgs.search.brave.com/68zXmQg1vM2aD-3424bbjbXILp41WrklRmCgq7HTWfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jbGVh/cmJ1eS1jbG91ZC5u/eWMzLmRpZ2l0YWxv/Y2VhbnNwYWNlcy5j/b20vbWVkaWEvMTAz/NTYvY3VzdG9tX2Zp/bGVuYW1lLmpwZw",
        category: "otherelectronics",
        brand: "tablet",
        rating: 4.6,
        quantity: 1,
      },
    ]

    const gaming = [
      {
        id: 17,
        title: "PlayStation 5 Pro",
        description: "Next-gen gaming console with enhanced graphics and performance.",
        price: 59999.99,
        image: "https://imgs.search.brave.com/WHjVuzeechcyBjCJRLbzuU1lpubY4Zb7tFOb_0zLw_4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nYW1lc3RvcC5j/b20vaS9nYW1lc3Rv/cC9QUzUtUFJPLWhl/cm8taW50aGVib3gt/dXMvcHM1JTIwcHJv/JTIwd2l0aCUyMHRo/ZSUyMGJveC53ZWJw",
        category: "otherelectronics",
        brand: "gaming",
        rating: 4.8,
        badge: "New",
        quantity: 1,
      },
      {
        id: 18,
        title: "Xbox Series X",
        description: "Powerful gaming console with fast loading times and high frame rates.",
        price: 44999.99,
        image: "https://imgs.search.brave.com/BZ2nUFdbVuH0h2zCtTBR2e8RuBnEZOQGfjVjzxs_62w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZHlubWVkaWEtMS5t/aWNyb3NvZnQuY29t/L2lzL2ltYWdlL21p/Y3Jvc29mdGNvcnAv/NjY3NDM4OTBfSGVy/by0wXzMwMDB4MTY4/MjpWUDItODU5eDU0/MA",
        category: "otherelectronics",
        brand: "gaming",
        rating: 4.7,
        quantity: 1,
      },
    ]

    const accessories = [
      {
        id: 19,
        title: "AirPods Pro 2",
        description: "Wireless earbuds with active noise cancellation and spatial audio.",
        price: 20999.99,
        image: "https://imgs.search.brave.com/eeP6rJfc54X-KRRMFtpxceIuQw3QB6Z6UjdGFSXIn0E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQXBw/bGUtQWlyUG9kcy1Q/cm8tMm5kLUdlbmVy/YXRpb24tTGlnaHRu/aW5nXzdlODU5OGJl/LTBhMDQtNDkzOC05/OGJlLTc2NWYxZmU4/MDQ0Ny4yZjIxODdl/ZWQ3MDAxMzU0ZmI0/OTExZmU0NTRkYzBk/Mi5qcGVnP29kbkhl/aWdodD02NDAmb2Ru/V2lkdGg9NjQwJm9k/bkJnPUZGRkZGRg",
        category: "otherelectronics",
        brand: "accessories",
        rating: 4.8,
        quantity: 1,
      },
      {
        id: 20,
        title: "Samsung Galaxy Watch 7",
        description: "Advanced smartwatch with health tracking and long battery life.",
        price: 29999.99,
        image: "https://imgs.search.brave.com/g0kQlpLZFsB78dL3SCxxL7rIRms6webIzzYM6SsoJGg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMxLmFucG9pbWFn/ZXMuY29tL3dvcmRw/cmVzcy93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNC8wOC9zYW1z/dW5nLWdhbGF4eS13/YXRjaC03LmpwZw",
        category: "otherelectronics",
        brand: "accessories",
        rating: 4.5,
        badge: "New",
        quantity: 1,
      },
    ]

    // Combine all products
    this.allProducts = [
      ...samsungProducts,
      ...appleProducts,
      ...xiaomiProducts,
      ...googleProducts,
      ...gamingPhones,
      ...appleLatops,
      ...dellLaptops,
      ...hpLaptops,
      ...lenovoLaptops,
      ...gamingLaptops,
      ...tablets,
      ...gaming,
      ...accessories,
    ]

    // Initialize filtered products
    this.filteredProducts = [...this.allProducts]
    this.calculateTotalPages()
  }

  // Filter methods
  filterByCategory(category: string): void {
    this.activeCategory = category
    this.activeBrand = "all" // Reset brand filter when changing category
    this.currentPage = 1 // Reset to first page
    this.applyFilters()
  }

  filterByBrand(brand: string): void {
    this.activeBrand = brand
    this.currentPage = 1 // Reset to first page
    this.applyFilters()
  }

  applyFilters(): void {
    // Start with all products
    let filtered = [...this.allProducts]

    // Apply category filter
    if (this.activeCategory !== "all") {
      if (this.activeCategory === "other") {
        // For "other" category, include tablets, gaming, and accessories
        filtered = filtered.filter(
          (product) =>
            product.category === "tablet" || product.category === "gaming" || product.category === "accessories",
        )
      } else {
        filtered = filtered.filter((product) => product.category === this.activeCategory)
      }
    }

    // Apply brand filter
    if (this.activeBrand !== "all") {
      if (this.activeCategory === "other") {
        // For "other" category, the brand filter actually filters by subcategory
        filtered = filtered.filter((product) => product.category === this.activeBrand)
      } else {
        filtered = filtered.filter((product) => product.brand === this.activeBrand)
      }
    }

    // Apply search filter
    if (this.searchTerm.trim() !== "") {
      const search = this.searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (product) => product.title.toLowerCase().includes(search) || product.description.toLowerCase().includes(search),
      )
    }

    // Apply sorting
    switch (this.sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      default: // featured - sort by rating
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    // Update filtered products
    this.filteredProducts = filtered
    this.calculateTotalPages()

    // Apply pagination
    this.applyPagination()
  }

  // Pagination methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage)
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    this.filteredProducts = this.filteredProducts.slice(startIndex, endIndex)
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return
    }
    this.currentPage = page
    this.applyFilters()
  }

  getPageNumbers(): number[] {
    const pages: number[] = []
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // Helper methods for brand/category lists
  getMobileBrands(): string[] {
    return ["Samsung", "Apple", "Xiaomi", "Google", "RedMagic"]
  }

  getLaptopBrands(): string[] {
    return ["Apple", "Dell", "HP", "Lenovo", "Asus"]
  }

  getOtherCategories(): string[] {
    return ["Tablet", "Gaming", "Accessories"]
  }

  // Product interaction methods
  increaseQuantity(product: any): void {
    product.quantity = (product.quantity || 1) + 1
  }

  decreaseQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--
    }
  }

  addToCart(product: any): void {
    // Create a cart item with the expected properties
    const cartItem = {
      id: product.id,
      title: product.title, // Use title as expected by CartService
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1,
      category: product.category,
      brand: product.brand,
      rating: product.rating,
    }

    // Add to cart using the service
    this.cartService.addToCart(cartItem)

    // Navigate to cart page (optional - you can remove this if you want to stay on the product page)
    this.router.navigate(["/cart"])
  }
}

