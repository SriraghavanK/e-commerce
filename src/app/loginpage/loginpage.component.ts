import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

@Component({
  selector: "app-loginpage",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./loginpage.component.html",
  styleUrls: ["./loginpage.component.css"],
})
export class LoginpageComponent {
  showSuccessMessage = false
  showFailureMessage = false

  closeAlert() {
    this.showSuccessMessage = false
    this.showFailureMessage = false
  }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  users = [
    {
      username: "admin",
      password: "admin",
    },
    {
      username: "user",
      password: "user",
    },
  ]

  login() {
    const { username, password } = this.loginform.value
    const user = this.users.find((u) => u.username === username && u.password === password)

    if (user) {
      this.showSuccessMessage = true
      setTimeout(() => {
        this.authService.login(user) // Use auth service to login
    }, 3000)
      

      setTimeout(() => {
        this.showSuccessMessage = false
        this.router.navigate(["home"])
      }, 3000)
      console.log("Login Successful")
    } else {
      console.log("Login Failed please fill all the fields")
      this.showFailureMessage = true
      setTimeout(() => {
        this.showFailureMessage = false
      }, 3000)
    }
  }

  loginform = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(4)]),
    password: new FormControl("", [Validators.required, Validators.minLength(4)]),
  })
}

