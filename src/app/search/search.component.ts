import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryDropdownComponent } from "../country-dropdown/country-dropdown.component";

interface Post {
  title: string;
  country: string;
  content: string;
}

@Component({
    selector: 'app-search',
    standalone: true,
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        CountryDropdownComponent
    ]
})
export class SearchComponent {
  /**
   * Text input for search.
   */
  searchText = '';

  /**
   * Array to store search results.
   */
  displayedResults: Post[] = [];

  /**
   * Count of total search results.
   */
  totalResults = 0;

  // EventEmitter to output search text changes.
  @Output() searchTextChange = new EventEmitter<string>();

  /**
   * Emits the current search text when a search is triggered.
   */
  onSearch() {
    this.searchTextChange.emit(this.searchText);
  }
}

