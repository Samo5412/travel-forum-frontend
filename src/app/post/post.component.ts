import {Component, OnInit } from '@angular/core';
import { ImageSliderComponent } from "../image-slider/image-slider.component";
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../services/backend.service';
import { Comment } from '../interfaces/comment';
import { Country } from '../interfaces/country';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { MessageComponent } from "../message/message.component";


@Component({
    selector: 'app-post',
    standalone: true,
    templateUrl: './post.component.html',
    styleUrl: './post.component.css',
    imports: [ImageSliderComponent,
        CommonModule,
        FormsModule, MessageComponent]
})

export class PostComponent implements OnInit {
  // properties
  post:any;
  country: Country | null = null;
  comment: Comment[] = [];
  newCommentContent: string = '';
  username: string | null = null;
  editingCommentId: string | null = null;
  tempCommentContent: string = '';
  imagesUrl: any[] = [];
  isEditingComment: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private authService: AuthService,
    private messageService: MessageService,
  ) {
  }

  /**
   * Initializes the component and fetches post data based on route parameters.
  */
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const postId = params.get('id');
      if (postId) {
          try {
              this.post = await this.backendService.getPostById(postId);
              this.post.comments = this.post?.comments || [];
              this.country = this.post?.country;
              this.loadImages(postId);
          } catch (error) {
              console.error('Error fetching post:', error);
          }
      }
  });
    this.loadCurrentUser();
  }

  /**
   * Loads the current user
   */
  async loadCurrentUser() {
    this.username = await this.authService.getCurrentUsername();
  }

  /**
   * Load the images from the backend
   */
  async loadImages(postId: string) {
    try {
        const postImages = await this.backendService.getPostImages(postId);

        // Clear the existing images
        this.imagesUrl = [];

        // Add the main image
        if (postImages.mainImage) {
          this.imagesUrl.push({
              url: postImages.mainImage,
              country: postImages.countryName,
              city: postImages.city
          });
      }
      // Add each additional image
      postImages.additionalImages.forEach(additionalImage => {
        this.imagesUrl.push({ 
            url: additionalImage,
            country: postImages.countryName,
            city: postImages.city 
        });
    });
    } catch (error) {
        console.error('Error loading images:', error);
    }
  }

  /**
   * Adds a new comment to the current post.
   * @param content The content of the new comment.
   */
  addComment(content: string) {
    this.backendService.addComment(this.post.id, content, this.username).then(response => {
        this.post.comments.push(response.comment);
        this.newCommentContent = '';
        this.messageService.showMessage(response.message, true);
    }).catch(error => {
         // Extracting the error message sent from the server
         let errorMessage = error.error.message; // Default message
      if (error.status === 401) {
          errorMessage = error.error.error; // Specific message for 401 errors
      } 
      this.messageService.showMessage(errorMessage, false);
    });
  }

  /**
   * Deletes a comment from the post.
   * @param postId The Id of the post from which the comment is to be deleted.
   * @param commentId The Id of the comment to delete.
   */
  deleteComment(postId: string, commentId: string) {
    this.backendService.deleteComment(postId, commentId, this.username).then(response => {
        this.post.comments = this.post.comments.filter((c: Comment) => c._id !== commentId);
        this.editingCommentId = null;
        this.messageService.showMessage(response.message, true);
    }).catch(error => {
      let errorMessage = error.error.message;
      if (error.status === 401) {
          errorMessage = error.error.error;
      } 
      this.messageService.showMessage(errorMessage, false);
    });
  }

  /**
   * Prepares a comment for editing by setting its Id and current content.
   * @param commentId The ID of the comment to be edited.
   * @param content The current content of the comment.
   */
  startEditComment(commentId: string, content: string) {
    this.editingCommentId = commentId;
    this.tempCommentContent = content;
    this.isEditingComment = true;
  }

  /**
   * Updates the content of an existing comment.
   * @param postId The Id of the post containing the comment.
   * @param commentId The Id of the comment to update.
   * @param newContent The new content for the comment.
   */
  updateComment(postId: string, commentId: string, newContent: string) {
    this.backendService.updateComment(postId, commentId, newContent, this.username).then(response => {
        let comment = this.post.comments.find((c: Comment) => c._id === commentId);
        if (comment) {
            comment.content = newContent;
            comment.updatedAt = new Date().toISOString();
        }
        this.editingCommentId = null; // Reset editingCommentId
        this.messageService.showMessage(response.message, true);
    }).catch(error => {
      let errorMessage = error.error.message; 
      if (error.status === 401) {
          errorMessage = error.error.error; 
      } 
      this.messageService.showMessage(errorMessage, false);
    });
  }

  /**
   * Toggles the like status of the post.
   * @param postId The Id of the post to toggle like status.
   */
  toggleLike(postId: string) {
    this.backendService.toggleLike(postId, this.username).then(response => {
        this.post.likes = response.likes;
        this.messageService.showMessage(response.message, true);
    }).catch(error => {
      let errorMessage = error.error.message; 
      if (error.status === 401) {
          errorMessage = error.error.error;
      } 
      this.messageService.showMessage(errorMessage, false);
    });
  }

  /**
   * Cancels updating a comment.
   */
  cancelEdit() {
    this.editingCommentId = null;
  }

}
