// Shapes several components share.

/**
 * A picture. Where the text beside it already names what it shows (a suggestion, an option, a tile), it is decorative
 * and `alt` is not used.
 */
export interface ImageSource {
  src: string;
  alt?: string;
}

/** Identifies an item in a list you pass in, such as an id from your data: a string or a number. */
export type ItemKey = string | number;
