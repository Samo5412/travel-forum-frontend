import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SearchComponent } from "../search/search.component";
import { BackendService } from '../services/backend.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DestinationsTableComponent } from '../destinations-table/destinations-table.component';
import { MessageService } from '../services/message.service';
import { AddPostComponent } from '../add-post/add-post.component';
import { MessageComponent } from "../message/message.component";

@Component({
    selector: 'app-my-destinations',
    standalone: true,
    templateUrl: './my-destinations.component.html',
    styleUrl: './my-destinations.component.css',
    imports: [
      DestinationsTableComponent, 
      SearchComponent, 
      CommonModule, 
      MessageComponent
    ]
})

export class MyDestinationsComponent {
  /**
   * Indicates if the user is logged in.
   */
  isLoggedIn: boolean = false;

  /**
   * Stores the current search text.
   */
  searchText: string = '';

  /**
   * the current user, null if no user.
   */
  currentUser: string | null = null;

  /**
   * Array to store posts related to the user.
   */
  userPosts: any[] = [];

  // Access to the AddPostComponent .
  @ViewChild(AddPostComponent) addPostComponent!: AddPostComponent;

  /**
   * Constructor function to inject services.
   * @param authService Service for authentication related operations.
   * @param backendService Service to fetch backend data.
   * @param router Router for navigation and route handling.
   * @param messageService Message service for managing messages displayed to the user.
   * @param changeDetection Detects changes and updates the view accordingly.
   */
  constructor(
    private authService: AuthService,
    private backendService: BackendService,
    private router: Router,
    private messageService: MessageService,
    private changeDetection: ChangeDetectorRef) {
  }

  /**
   * Gets current user and loads user-specific posts.
   */
  ngOnInit() {
    this.loadCurrentUser();
    this.loadUserPosts();
    
  }

  /**
   * Loads current username
   */
  async loadCurrentUser() {
    this.currentUser = this.authService.getCurrentUsername();
  }

  /**
   * Loads posts made by the current user.
   */
  private async loadUserPosts() { 
    try {
      const allPosts = await this.backendService.getPostsForTable();
      this.userPosts = allPosts.filter(post => post.author === this.currentUser);
      this.changeDetection.detectChanges();
    } catch (error) {
      console.error('Error loading user posts:', error);
    }

  }

  /**
   * Updates the search text based on user input.
   * @param searchText The current text entered in the search field.
   */
  handleSearch(searchText: string) {
    this.searchText = searchText;
  }

   /**
   * Deletes a specific post after user confirmation.
   * @param postId The Id of the post to be deleted.
   */
  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
        this.backendService.deletePost(postId)
            .then(response => {
                this.messageService.showMessage(response.message, true)
                this.loadUserPosts(); // Reload the posts to update the list
            })
            .catch(error => this.messageService.showMessage(error.message, false));
    }
  }

  /**
  * Navigates to the add post page.
  */
  addNewPost(): void {
    if (this.currentUser == null) {
      this.messageService.showMessage('Error retrieving username. Please log in again to continue.', false);
      return;
    }
    this.router.navigate(['/add-post']);
  }
}
