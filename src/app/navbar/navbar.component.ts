import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription, filter } from 'rxjs';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive
  ],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  /**
   * Flag to control the visibility of the navigation bar for logged in users.
   */
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  isInitialized = false;
  
  /**
   * Constructor function to inject services.
   * @param authService Service for authentication related operations.
   * @param router Router for navigation and route handling.
   * @param messageService Message service for managing messages displayed to the user.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  /**
  * Initializes component and subscribes to the authentication 
  * status observable to track user's login status.
  */
  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
      }
    );
  }

  /**
   * Handles the logout success and error scenarios.
   */
  logout(): void {
    this.authService.logout().then(response => {
      this.messageService.showMessage(response.message, true);
      this.router.navigate(['/login']);
    }).catch(error => {
      this.messageService.showMessage(error.message, false);
      console.error('Logout error:', error);
    });
  }

  /**
   * Lifecycle hook called before Angular destroys the component.
   * Unsubscribes from the authentication status observable to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}