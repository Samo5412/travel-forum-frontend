import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css'
})
export class ImageSliderComponent {
  /**
   * Input array to store image data.
   */
  @Input() images: any[] = [];

  /**
   * Input flag to indicate if images are clickable.
   */
  @Input() clickableImages: boolean = true;

  /**
   * Currently selected image.
   */
  currentImage: any;

  /**
   * Array of thumbnails for display.
   */
  visibleThumbnails: any[] = [];


  /**
   * Constructor function to inject services.
   */
  constructor(private router: Router) {}

  /**
   * Responds to changes in input properties of the component.
   * @param changes Object containing the current and previous property values.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['images'] && this.images.length) {
      this.currentImage = this.images[0];
      this.visibleThumbnails = this.images.slice(0, 7);
    }
  }

  /**
   * Changes the current image
   * @param imageThe the new image to be set as the current image.
   */
  changeImage(image: any) {
    this.currentImage = image;
  }

  /**
   * Navigates the thumbnails in the gallery.
   * It checks the direction and shift the thumbnails position if 
   * there are more thumbnails after the first/last visible one.
   * @param direction The 'previous' or 'next' direction.
   */
  navigateThumbnails(direction: string) {
    const totalImages = this.images.length;
    const firstVisibleIndex = this.images.indexOf(this.visibleThumbnails[0]);

    if (direction === 'prev' && firstVisibleIndex > 0) {
      this.visibleThumbnails = this.images.slice(Math.max(firstVisibleIndex - 1, 0), firstVisibleIndex + 6);
    } else if (direction === 'next' && firstVisibleIndex < totalImages - 7) {
      this.visibleThumbnails = this.images.slice(firstVisibleIndex + 1, Math.min(firstVisibleIndex + 8, totalImages));
    }
  }

  /**
   * Checks if the image has a link property
   * @param image The image to check
   * @returns True if the image has a link, false otherwise. 
   */
  hasLink(image: any): boolean {
    return image && image.link != null;
  }

  /**
   * Navigate to the specified route
   * @param postId The post ID to navigate to.
   */
  navigateToPost(postId: string) {
    this.router.navigate(['/posts', postId]);
  }

  /**
   * Extracts the post Id from a given URL.
   * @param link The URL from which the post Id is to be extracted.
   * @returns The extracted post ID, or an empty string if not found.
   */
  extractPostId(link: string): string {
    const segments = link.split('/');
    return segments.length > 1 ? segments[1] : '';
  }
  
}
