import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { SearchComponent } from "../search/search.component";
import { FormsModule } from '@angular/forms';
import { Destination } from '../interfaces/destination';
import { BackendService } from '../services/backend.service';
import { DestinationsTableComponent } from "../destinations-table/destinations-table.component";
import { MessageComponent } from "../message/message.component";


@Component({
    selector: 'app-destinations',
    standalone: true,
    templateUrl: './destinations.component.html',
    styleUrl: './destinations.component.css',
    imports: [
        ImageSliderComponent,
        CommonModule,
        SearchComponent,
        FormsModule,
        DestinationsTableComponent,
        MessageComponent
    ]
})
export class DestinationsComponent {
  /**
   * Holds the current search text.
   */
  searchText: string = '';
  
  /**
   * Array to store Destination objects.
   */
  destinations: Destination[] = [];

  /**
   * Array to store the main images of all destinations
   */
  mainImages: any[] = [];
  
  /**
   * Constructor function to inject services.
   * @param backendService Service to fetch backend data.
   * @param changeDetection Detects changes and updates the view accordingly.
   */
  constructor(
    private backendService: BackendService, 
    private changeDetection: ChangeDetectorRef
    ) {}
  
  /**
   * Lifecycle hook that executes after component initialization.
   */
  ngOnInit() {
    this.loadDestinations();
    this.loadImages();
  }

  /**
   * Updates the search text based on user input.
   * @param searchText The current text entered in the search field.
   */
  handleSearch(searchText: string) {
    this.searchText = searchText;
  }

  /**
   * loads destinations from the backend service.
   */
  async loadDestinations() {
    try {
      const posts = await this.backendService.getPostsForTable();
      this.destinations = posts;
      this.changeDetection.detectChanges();
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  }

  /**
   * loads images for the image slider.
   */
  async loadImages() {
    try {
      const posts = await this.backendService.getImageSliderData();
      this.mainImages = posts.map(post => ({
        url: post.mainImage,
        country: post.countryName,
        city: post.city,
        link:`posts/${post.id}`
      }));
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }
}
