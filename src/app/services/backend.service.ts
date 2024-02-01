import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Country } from '../interfaces/country';
import { Post } from '../interfaces/post';
import { Destination } from '../interfaces/destination';

// Mark the BackendService as injectable using the @Injectable() decorator.
@Injectable({
  providedIn: 'root'
})

/**
 * The BackendService class provides methods to interact with the backend API.
 */
export class BackendService {

  // The URL of the backend API
  private readonly API_URL = 'https://samo2201-project-backend-dt190g-ht23.azurewebsites.net/api/v1';
  /**
   * The constructor for the BackendService class.
   * @param http The HttpClient service
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all countries.
   * @returns a Promise that resolves to an array of Course objects.
   */
  async getAllCountries(): Promise<Country[]> {
    const endpoint = `${this.API_URL}/countries`;
    const responsePromise = this.http.get<Country[]>(endpoint);
    return await firstValueFrom(responsePromise);
  }

  /**
   * Gets an array of Destination objects representing posts displayed on the table.
   * @returns A promise that resolves to an array of Destination objects.
   */
  async getPostsForTable(): Promise<Destination[]> {
    const endpoint = `${this.API_URL}/post`;
    const response = await firstValueFrom(this.http.get<any[]>(endpoint));
    return response.map(post => ({
      id: post.id,
      flag: post.country?.flag,
      country: post.country?.name,
      title: post.title,
      author: post.author
    }));
  }

  /**
   * Gets a subset of post data containing id, mainImage, city, and country.
   * @returns a Promise of an array of Posts with only the needed properties.
   */
  async getImageSliderData(): Promise<{ id: string, mainImage: string, city: string, countryName: string }[]> {
    const endpoint = `${this.API_URL}/post`;
    const response = await firstValueFrom(this.http.get<Post[]>(endpoint));
    return response.map(post => ({
      id: post.id,
      mainImage: post.mainImage,
      city: post.city,
      countryName: post.country.name 
    }));
  }

  /**
   * Gets the images related to specific country
   * @returns a Promise of an array of Posts with only the needed properties.
   */
  async getPostImages(postId: string): Promise<{ mainImage: string, city: string, countryName: string, additionalImages: string[] }> {
    const endpoint = `${this.API_URL}/posts/${postId}`;
    const response = await firstValueFrom(this.http.get<any>(endpoint)); 
    return {
      mainImage: response.mainImage,
      city: response.city,
      countryName: response.country.name,
      additionalImages: response.additionalImages
    };
  }

  /**
   * Deletes a post by its Id
   * @param id The Is of the post to be deleted.
   * @returns A Promise resolving to the deletion response.
   */
  async deletePost(id: string): Promise<any> {
    const endpoint = `${this.API_URL}/posts/${id}`;
    const response = this.http.delete(endpoint,  { withCredentials: true });
    return await firstValueFrom(response);
  }
 
  /**
   * Adds a new post.
   * @param postData Data of the post to be added.
   * @returns A Promise resolving to the post creation response.
  */
  async addPost(postData: Post): Promise<any> {
    const endpoint = `${this.API_URL}/add-post`;
    const response = this.http.post(endpoint, postData,  { withCredentials: true });
    return await firstValueFrom(response);
  }

  /**
   * Retrieves a specific post by its Id.
   * @param id The unique identifier of the post.
   * @returns A Promise resolving to the retrieved post.
  */
  async getPostById(id: string): Promise<Post> {
    const endpoint = `${this.API_URL}/posts/${id}`;
    const responsePromise = this.http.get<Post>(endpoint);
    return await firstValueFrom(responsePromise);
  }

  /**
   * Adds a comment to a specific post.
   * @param postId The Id of the post to add the comment to.
   * @param content The content of the comment.
   * @param username The username of the commenter, can be null
   * @returns A Promise resolving to the comment creation response.
  */
  async addComment(postId: string, content: string, username: string | null): Promise<any> {
    const responsePromise = this.http.post(
        `${this.API_URL}/posts/${postId}/comments`, 
        { content, username }, 
        { withCredentials: true }
    );
    return await firstValueFrom(responsePromise);
  }

  /**
   * Deletes a specific comment from a post.
   * @param postId The Id of the post from which the comment is to be deleted.
   * @param content The content of the comment.
   * @param username The username of the user attempting to delete the comment, can be null.
   * @returns Promise resolving to the deletion response.
  */
  async deleteComment(postId: string, commentId: string, username: string | null): Promise<any> {
    const responsePromise = this.http.request('delete', 
      `${this.API_URL}/posts/${postId}/comments/delete/${commentId}`, 
      {
        body: { username },
        withCredentials: true
      });
    return await firstValueFrom(responsePromise);
  }

  /**
   * Updates a specific comment on a post.
   * @param postId The Id of the post with the comment to update.
   * @param commentId The Id of the comment to update.
   * @param content The new content of the comment.
   * @param username The username of the commenter, can be null.
   * @returns A Promise resolving to the update response.
 */
  async updateComment(postId: string, commentId: string, content: string, username: string | null): Promise<any> {
    const responsePromise = (this.http.put(
      `${this.API_URL}/posts/${postId}/comments/update/${commentId}`, 
      { content, username },  
      { withCredentials: true }));
    return await firstValueFrom(responsePromise);
  }

  /**
   * Toggles the like status of a post for a given user.
   * @param postId The Id of the post to toggle the like status.
   * @param username The username of the user toggling the like, can be null.
   * @returns A Promise resolving to the like toggle response.
  */
  async toggleLike(postId: string, username: string | null): Promise<any> {
    const responsePromise = (
      this.http.post(`${this.API_URL}/posts/${postId}/like`, 
      { username }, 
      { withCredentials: true }));
    return await firstValueFrom(responsePromise); 
  }
}
