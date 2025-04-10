import { Component , ElementRef,ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive , ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css' , '../app.component.css']})
export class AboutComponent {
  imagePath: string = 'assets/logo.jpg';
  @ViewChild('storySection') storySection!: ElementRef;
  @ViewChild('teamSection') teamSection!: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'story') {
        this.scrollToSection(this.storySection);
      } else if (fragment === 'team') {
        this.scrollToSection(this.teamSection);
      }
    });
  }

  scrollToSection(section: ElementRef) {
    section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
