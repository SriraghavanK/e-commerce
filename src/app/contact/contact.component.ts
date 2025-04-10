import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [RouterLink , RouterLinkActive , FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css' , '../app.component.css']
})
export class ContactComponent {
  contactForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
  }

  onSubmit() {
    // Implement form submission logic here
    console.log("Form submitted:", this.contactForm)
    // Reset the form
    this.contactForm = {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  }
}


