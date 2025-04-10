import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  location: string;
  bio: string;
  social: {
    discord: string;
    linkedin: string;
    github: string;
  };
  stats: {
    projects: number;
    followers: number;
    following: number;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private users: User[] = [
    {
      id: 1,
      username: "admin",
      password: "admin",
      name: "Admin User",
      email: "admin@example.com",
      phone: "+91 9876543210",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Administrator",
      location: "Chennai, India",
      bio: "Experienced administrator with a passion for system design and optimization.",
      social: {
        discord: "admin_user",
        linkedin: "admin-user",
        github: "admin-dev",
      },
      stats: {
        projects: 24,
        followers: 356,
        following: 128,
      },
    },
    {
      id: 2,
      username: "user",
      password: "user",
      name: "Sriraghavan K",
      email: "ayyangarbadrinarayanan@gmail.com",
      phone: "+91 9362623850",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      role: "Software Engineer",
      location: "Chennai, India",
      bio: "Full-stack developer with expertise in Angular and Node.js.",
      social: {
        discord: "users/741917149362126969",
        linkedin: "sriraghavan-k-7717b6257",
        github: "/SriraghavanK",
      },
      stats: {
        projects: 12,
        followers: 156,
        following: 48,
      },
    },
  ];

  constructor(private router: Router) {
    if (typeof window !== "undefined" && localStorage) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
        this.isLoggedInSubject.next(true);
      }
    }
  }

  login(credentials: { username: string; password: string }): boolean {
    const user = this.users.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      this.currentUserSubject.next(userWithoutPassword as User);
      this.isLoggedInSubject.next(true);
      this.router.navigate(["/home"]); // Redirect after login
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(["/login"]);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserProfile(updatedUser: Partial<User>) {
    const currentUser = this.currentUserSubject.value;

    if (currentUser) {
      const updatedUserData = { ...currentUser, ...updatedUser };

      const userIndex = this.users.findIndex((u) => u.id === currentUser.id);
      if (userIndex >= 0) {
        this.users[userIndex] = { ...this.users[userIndex], ...updatedUser } as User;
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
      this.currentUserSubject.next(updatedUserData);
      return true;
    }

    return false;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
