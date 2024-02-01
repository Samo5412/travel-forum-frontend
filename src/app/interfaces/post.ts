import { Country } from "./country";

/**
 * This interface represents a Post
 */
export interface Post {
    id: string;
    title: string;
    author: string;
    content: string;
    mainImage: string;
    additionalImages: string[];
    country: Country;
    city: string;
    likes: [string];
    comments: Comment[];
    createdAt: Date; 
    updatedAt: Date;
}
