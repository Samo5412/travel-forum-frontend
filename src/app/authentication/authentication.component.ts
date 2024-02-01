import { Component, OnInit, ViewChild } from '@angular/core';
import { CountryDropdownComponent } from '../country-dropdown/country-dropdown.component';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../message/message.component";

@Component({
    selector: 'app-authentication',
    standalone: true,
    templateUrl: './authentication.component.html',
    styleUrl: './authentication.component.css',
    imports: [
        CountryDropdownComponent,
        FormsModule,
        CommonModule,
        MessageComponent
    ]
})

export class AuthenticationComponent implements OnInit {
  // A viewChild to access the component
  @ViewChild(CountryDropdownComponent)
  private countryDropdownComponent!: CountryDropdownComponent;
  
  // Declaring properties for user registration form fields
  firstName: string = '';
  lastName: string = '';
  usernameReg: string = '';
  passwordReg: string = '';
  confirmPassword: string = '';
  country: string = '';

  // Declaring properties for login form fields
  usernameLog: String = '';
  passwordLog: String = '';

  /**
   * Constructor function to inject services.
   * @param authService Service for authentication related operations.
   * @param router Router for navigation and route handling.
   * @param messageService Message service for managing messages displayed to the user.
   */
  constructor(
    private authService: AuthService, 
    private messageService: MessageService,
    private router: Router
    ) {}
    
    ngOnInit() {
      // Logs out the user when the login route is accessed
      this.authService.logout().then(() => {
        console.log('Logging out');
      });
    }

  // Code for registering
  /**
   * Handles user registration
   */
  async onRegister(): Promise<void> {

    // Check if the passwords match and displays a message accordingly
    if (this.passwordReg !== this.confirmPassword) {
      this.messageService.showMessage('Passwords do not match', false);
      return;
    }

    // Create a new user object with the form data
    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.usernameReg,
      password: this.passwordReg,
      country: this.country
    };

    // send the form data to the backend service to register the user.
    // Show a message according to the registration status
    try {
      const response = await this.authService.registerUser(newUser);
      this.messageService.showMessage(response.message, true);
      this.clearForm();
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Unknown error occurred';
      this.messageService.showMessage(errorMessage, false);
    }  
  }

  /**
   * Handles the country selection.
   * @param countryName The country name
   */
  onCountrySelect(countryName: string): void {
    this.country = countryName;
  }

  /**
   * Resets the form fields
   */
  clearForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.usernameReg = '';
    this.passwordReg = '';
    this.confirmPassword = '';
    this.countryDropdownComponent.resetDropdown();
  }

  /**
   * Checks if all the registration fields are valid
   * @returns True if all fields are filled, false otherwise.
   */
  isRegisterFormValid(): boolean {
    return (
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.usernameReg.trim() !== '' &&
      this.passwordReg.trim() !== '' &&
      this.confirmPassword.trim() !== '' &&
      this.country.trim() !== ''
    );
  }

  // Code for login

  /**
   * Handles the user login
   */
  async onLogin(): Promise<void> {
    const credentials = {
      username: this.usernameLog,
      password: this.passwordLog
    };
  
    try {
      // Await the login process to complete
      const response = await this.authService.loginUser(credentials);
      this.messageService.showMessage(response.message, true);
  
      // After login, check if the user is logged in before navigating
      if (this.authService.checkLoginStatus()) {
        this.router.navigate(['/destinations']);
      } else {
        // Handle the case where login status is not updated
        this.messageService.showMessage("Login failed. Please try again.", false);
      }
    } catch (error: any) {
      // Show error message if login fails
      this.messageService.showMessage(error.error.message, false);
    }
  }

  /**
   * Checks if the fields of the loin form are filled.
   * @returns True if the form is valid, false otherwise.
   */
  isLoginFormValid(): boolean {
    return this.usernameLog.trim() !== '' && this.passwordLog.trim() !== '';
  }
}
