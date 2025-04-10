import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import  { AuthService, User } from "../services/auth.service"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  user: User | null = null
  isLoading = true
  isEditMode = false
  isSaving = false
  showSuccessMessage = false
  profileForm!: FormGroup

  // Avatar upload properties
  selectedFile: File | null = null
  previewUrl: string | null = null
  isUploading = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.profileForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      role: [""],
      location: [""],
      bio: [""],
      "social.discord": [""],
      "social.linkedin": [""],
      "social.github": [""],
    })

    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe((user) => {
      this.user = user
      this.isLoading = false

      // If no user is logged in, redirect to login
      if (!user) {
        this.router.navigate(["/login"])
        return
      }

      // Populate the form with user data
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        bio: user.bio,
        "social.discord": user.social.discord,
        "social.linkedin": user.social.linkedin,
        "social.github": user.social.github,
      })
    })
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode

    // Reset preview when toggling edit mode
    if (this.isEditMode) {
      this.previewUrl = null
      this.selectedFile = null
    }

    // If canceling edit mode, reset form to original values
    if (!this.isEditMode && this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        role: this.user.role,
        location: this.user.location,
        bio: this.user.bio,
        "social.discord": this.user.social.discord,
        "social.linkedin": this.user.social.linkedin,
        "social.github": this.user.social.github,
      })
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched()
      return
    }

    this.isSaving = true

    // Prepare the updated user data
    const formValues = this.profileForm.value
    const updatedUser: Partial<User> = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      role: formValues.role,
      location: formValues.location,
      bio: formValues.bio,
      social: {
        discord: formValues["social.discord"],
        linkedin: formValues["social.linkedin"],
        github: formValues["social.github"],
      },
    }

    // If we have a new avatar (from the preview), add it to the updated user data
    if (this.previewUrl) {
      updatedUser.avatar = this.previewUrl
    }

    // Update the user profile
    const success = this.authService.updateUserProfile(updatedUser)

    if (success) {
      this.showSuccessMessage = true

      // Reset file upload state
      this.selectedFile = null
      this.previewUrl = null

      setTimeout(() => {
        this.isSaving = false
        this.showSuccessMessage = false
        this.isEditMode = false
      }, 2000)
    } else {
      this.isSaving = false
    }
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  // File upload methods
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (!input.files?.length) {
      return
    }

    const file = input.files[0]

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WebP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB")
      return
    }

    this.selectedFile = file
    this.createImagePreview(file)
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader()

    reader.onload = () => {
      this.previewUrl = reader.result as string
    }

    reader.readAsDataURL(file)
  }

  cancelImageUpload(): void {
    this.selectedFile = null
    this.previewUrl = null
  }

  // Method to update only the avatar
  updateAvatar(): void {
    if (!this.previewUrl) return

    this.isUploading = true

    // In a real app, you would upload the file to a server here
    // For now, we'll simulate a delay and then update the user profile
    setTimeout(() => {
      const success = this.authService.updateUserProfile({
        avatar: this.previewUrl ?? undefined,
      })

      if (success) {
        this.showSuccessMessage = true

        setTimeout(() => {
          this.showSuccessMessage = false
          this.isUploading = false
          this.selectedFile = null
          // Keep the preview URL as it's now the current avatar
        }, 2000)
      } else {
        this.isUploading = false
      }
    }, 1000) // Simulate network delay
  }
  
}
