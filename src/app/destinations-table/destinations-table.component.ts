import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Destination } from '../interfaces/destination';
import { Router } from '@angular/router';


@Component({
  selector: 'app-destinations-table',
  standalone: true,
  imports: [CommonModule,
  FormsModule],
  templateUrl: './destinations-table.component.html',
  styleUrl: './destinations-table.component.css'
})
export class DestinationsTableComponent implements OnChanges  {
  /**
   * Input for search text. 
   */
  @Input() searchText: string = '';

  /**
   * Input array of destinations.
   */
  @Input() destinations: Destination[] = [];

  /**
   * Filtered list of destinations for display.
   */
  filteredDestinations: Destination[] = [];

  /**
   * Limit for the number of destinations to display.
   */
  displayLimit: number = 10;

  /**
   * Input to show/hide actions in the table.
   */
  @Input() showActions: boolean = false;

  /**
   * Output event when a destination is deleted.
   */
  @Output() onDelete = new EventEmitter<any>();

  /**
   * Output event for navigation.
   */
  @Output() onNavigate = new EventEmitter<string>();

  /**
   * Constructor function to inject services.
   * @param router Router for navigation and route handling.
   */
  constructor(private router: Router) {}

  /**
   * Responds to changes in input properties of the component.
   * @param changes Object containing the current and previous property values.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['destinations']) {
      this.sortDestinations(); 
      this.filteredDestinations = this.destinations.slice(0, this.displayLimit);
    }
    if (changes['searchText']) {
      this.filterDestinations();
    }
  }

  /**
  * Filters destinations based on the search text and limits the display.
  */
  filterDestinations() {
    const filtered = this.destinations.filter(destination => 
      destination.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      destination.country.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.filteredDestinations = filtered.slice(0, this.displayLimit);
  }

   /**
   * Sorts the destinations alphabetically by country.
   */
  private sortDestinations() {
    this.destinations.sort((a, b) => a.country.localeCompare(b.country));
  }

  /**
   * Emits the delete event and stops event propagation.
   * @param destination - The destination to be deleted.
   * @param event - The event object.
   */
  handleDelete(destination: any, event: Event) {
    event.stopPropagation();
    this.onDelete.emit(destination);
  }

  /**
   * Navigates to a specific post.
   * @param postId The Ids of the post to navigate to.
   */
  navigateTo(postId: string) {
    this.router.navigate(['/posts', postId]);
  }
}
