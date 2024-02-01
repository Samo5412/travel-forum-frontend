import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  // The URL of the backend API
  private readonly API_URL = 'https://samo2201-project-backend-dt190g-ht23.azurewebsites.net/api/v1';
  
  // BehaviorSubject to hold the current login status, initially set to false.
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // BehaviorSubject to store the current username, initially set to null.
  private currentUsernameSubject = new BehaviorSubject<string | null>(null);


  /**
   * Constructs the AuthService and injects dependencies.
   * @param http HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    this.updateSessionData();
  }

  /**
   * Registers a new user.
   * @param newUser The new user's registration data.
   * @returns An Observable resolving to the registration response.
   */
  async registerUser(newUser: any): Promise<any> {
    const response = this.http.post<any>(`${this.API_URL}/register`, newUser);
    return await firstValueFrom(response);
  }

  /**
   * Logs in a user with the provided credentials.
   * @param credentials Login credentials of the user.
   * @returns A Promise resolving to the login response.
   */
  async loginUser(credentials: any): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(`${this.API_URL}/login`, credentials, { withCredentials: true }));
    this.updateSessionState(response.isLoggedIn, response.username);
    return response;
  }

  /**
   * Logs out the current user.
   * @returns A Promise resolving to the logout response.
   */
  async logout(): Promise<any> {
    const response = await firstValueFrom(this.http.get<any>(`${this.API_URL}/logout`, { withCredentials: true }));
    this.updateSessionState(false, null);
    return response;
  }

  /**
   * Updates the session data by fetching it from the server.
   */
  async updateSessionData(): Promise<void> {
    try {
      const sessionData = await firstValueFrom(this.http.get<any>(`${this.API_URL}/session`, { withCredentials: true }));
      this.updateSessionState(sessionData.isLoggedIn, sessionData.username);
    } catch (error) {
      console.error('Error fetching session data:', error);
      this.updateSessionState(false, null);
    }
  }

  /**
   * Checks if a user is currently logged in.
   * @returns Boolean indicating if the user is logged in (based on the presence of a username).
   */
  checkLoginStatus(): boolean {
    return this.currentUsernameSubject.value != null;
  }

  /**
   * Retrieves the current username.
   * @returns The current username or null if not logged in.
   */
  getCurrentUsername(): string | null {
    return this.currentUsernameSubject.value;
  }

  /**
   * Exposes an observable for the login status.
   */
  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Exposes an observable for the current username.
   */
  get currentUsername$(): Observable<string | null> {
    return this.currentUsernameSubject.asObservable();
  }

  /**
   * Updates the state for login status and current username.
   * @param isLoggedIn The user's login status.
   * @param username  The current username or null if not logged in.
   */
  private updateSessionState(isLoggedIn: boolean, username: string | null): void {
    this.isLoggedInSubject.next(isLoggedIn);
    this.currentUsernameSubject.next(username);
  }
}
