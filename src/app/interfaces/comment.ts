/**
 * This interface represents a comment.
 */
export interface Comment {
    _id: string;
    author: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
