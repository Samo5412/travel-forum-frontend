import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BackendService } from '../services/backend.service';
import { CommonModule } from '@angular/common';
import { CountryDropdownComponent } from "../country-dropdown/country-dropdown.component";
import { MessageService } from '../services/message.service';
import { MessageComponent } from "../message/message.component";

@Component({
    selector: 'app-add-post',
    standalone: true,
    providers: [
        AuthService,
    ],
    templateUrl: './add-post.component.html',
    styleUrls: ['./add-post.component.css'],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule, 
      CountryDropdownComponent,   
      MessageComponent]
})

export class AddPostComponent {
  
  /* FormGroup instance for handling post form */
  postForm!: FormGroup;

  /* Current logged-in user's name */
  currentUser: string | null = null;

  /* Selected country */
  country: string = '';

  /* Count of characters in the title field */
  titleCharacterCount: number = 0;

  /* Maximum allowed length for title */
  maxTitleLength: number = 50;

  /* Count of characters in the content field */
  contentCharacterCount: number = 0;

  /* Minimum required length for content */
  minContentLength: number = 100;

  /* Flag for main image URL validation */
  isMainImageUrlInvalid: boolean = false;

  // A viewChild to access the component
  @ViewChild(CountryDropdownComponent)
  private countryDropdownComponent!: CountryDropdownComponent;

  /**
   *  Constructor function to inject services.
   * @param formBuilder FormBuilder for creating form controls
   * @param authService Service for authentication related operations.
   * @param backendService Service to fetch backend data.
   * @param messageService Message service for managing messages displayed to the user. 
   */
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private backendService: BackendService,
    private messageService: MessageService 
  ) {
   
  }

  /**
   * Initializes the component by subscribing to username changes and initializing the form.
   */
  ngOnInit() {
    this.subscribeToUsernameChanges();
    this.initializeForm();
  }

  /**
   * Subscribes to changes in the current username from AuthService.
   * Updates the local currentUser variable and the author field in the form on each change.
   */
  private subscribeToUsernameChanges() {
    this.authService.currentUsername$.subscribe((username: string | null) => {
      this.currentUser = username;
      this.updateAuthorField();
    });
  }

  /**
   * Updates the 'author' field in the form with the current username.
   */
  private updateAuthorField() {
    const authorControl = this.postForm.get('author');
    if (authorControl) {
      authorControl.setValue(this.currentUser);
    }
  }

  /**
   * Handles country selection
   * @param countryName The country name selected
   */
  onCountryChange(countryName: string): void {
    const countryControl = this.postForm.get('country');
    if (countryControl) {
      countryControl.setValue(countryName);
    } 
  }
  
  /**
   * Initializes the form by setting up form controls and subscribing to form changes.
  */
  private initializeForm() {
    this.setUpFormControls();
    this.subscribeToFormChanges();
  }
  
  /**
   * Sets up form controls with validation.
  */
  private setUpFormControls() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(this.maxTitleLength)]],
      content: ['', [Validators.required, Validators.minLength(this.minContentLength)]],
      mainImage: ['', [Validators.required, this.validateUrl]],
      additionalImages: this.formBuilder.array([]),
      country: ['', Validators.required],
      city: ['', Validators.required],
      author: [{value: this.authService.getCurrentUsername(), disabled: true}]
    });
  }
  
  /**
  * Subscribes to form control value changes for dynamic UI updates.
  */
  private subscribeToFormChanges() {
    const titleControl = this.postForm.get('title');
    if (titleControl) {
      titleControl.valueChanges.subscribe(value => {
        this.titleCharacterCount = value ? value.length : 0;
      });
    }
  
    const contentControl = this.postForm.get('content');
    if (contentControl) {
      contentControl.valueChanges.subscribe(value => {
        this.contentCharacterCount = value ? value.length : 0;
      });
    }
  
    const mainImageControl = this.postForm.get('mainImage');
    if (mainImageControl) {
      mainImageControl.valueChanges.subscribe(() => {
        this.isMainImageUrlInvalid = mainImageControl.invalid && mainImageControl.dirty;
      });
    }
  }
  
  /**
   * Custom validator for URL fields.
   * @param control  FormControl instance to validate.
   * @returns Validation errors if the URL is invalid, otherwise null.
  */
  validateUrl(control: FormControl): ValidationErrors | null {
    const urlPattern = new RegExp('^(http[s]?:\\/\\/)?[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\\/.*)?$');
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }

  /**
   * Getter for the additionalImages form array.
   * @returns The FormArray instance for additional images.
  */
  get additionalImages(): FormArray {
    return this.postForm.get('additionalImages') as FormArray;
  }

  /**
   * Adds a new form control for an additional image URL and validates the URL.
  */
  addAdditionalImage() {
    this.additionalImages.push(this.formBuilder.control('', [Validators.required, this.validateUrl]));
  }
  
  /**
   * Removes an additional image form control at specified index.
   * @param index  Index of the control to remove.
  */
  removeAdditionalImage(index: number) {
    this.additionalImages.removeAt(index);
  }

  /**
   * Handles form submission, including post creation.
  */
  onSubmit() {
    if (this.postForm.valid) {
        const postData = {
            ...this.postForm.getRawValue(), // include disabled fields
            author: this.currentUser
        };
        
        // Add new post
        this.backendService.addPost(postData).then(response => {
            this.messageService.showMessage(response.message, true);
            this.resetFormFields();
        }).catch(error => {
            this.messageService.showMessage(error.message, false);
        });
    }
  }

  /**
   * Resets the form fields to their initial state.
  */
  private resetFormFields() {
    // Clear all fields 
    this.postForm.reset();
    this.countryDropdownComponent.resetDropdown();
    // Reset additional images
    while (this.additionalImages.length !== 0) {
      this.additionalImages.removeAt(0);
    }
  }
}