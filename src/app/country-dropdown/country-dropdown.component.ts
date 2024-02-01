import { Component, EventEmitter, Output } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Country } from '../interfaces/country';
import { CommonModule,  } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-country-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,],
  templateUrl: './country-dropdown.component.html',
  styleUrl: './country-dropdown.component.css'
})
export class CountryDropdownComponent {

  /**
   * The list of countries to display in the dropdown.
   */
  countries: Country[] = []; 

  /**
   * The selected country
   */
  selectedCountry: string | null = null; 

  // Event emitter for the selected country
  @Output() countryChange = new EventEmitter<string>();

  /**
   * Constructor function to inject services.
   * @param backendService Service to fetch backend data.
   */
  constructor(private backendService: BackendService) {}

  /**
   * Fetches all country names on component initialization
   */
  async ngOnInit(): Promise<void> {
    const allCountries = await this.backendService.getAllCountries();
    this.countries = allCountries.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Emits the selected country.
   */
  onCountrySelect(): void {
    if (this.selectedCountry !== null) {
      this.countryChange.emit(this.selectedCountry);
    }
  }

  /**
   * Resets the selected country
   */
  resetDropdown(): void {
    this.selectedCountry = null;
  }
}
