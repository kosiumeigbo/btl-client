/* JSON response from NYT Best Sellers API */

export interface BestSellersData {
  list_id: number;
  list_name: string;
  list_name_encoded: string;
  display_name: string;
  updated: string;
  list_image: any;
  list_image_width: any;
  list_image_height: any;
  books: BookRes[];
}

interface BookRes {
  age_group: string;
  amazon_product_url: string;
  article_chapter_link: string;
  author: string;
  book_image: string;
  book_image_width: number;
  book_image_height: number;
  book_review_link: string;
  contributor: string;
  contributor_note: string;
  created_date: string;
  description: string;
  first_chapter_link: string;
  price: string;
  primary_isbn10: string;
  primary_isbn13: string;
  book_uri: string;
  publisher: string;
  rank: number;
  rank_last_week: number;
  sunday_review_link: string;
  title: string;
  updated_date: string;
  weeks_on_list: number;
  buy_links: BuyLink[];
}

interface BuyLink {
  name: string;
  url: string;
}

/* ---------------------------------------- */

/* JSON response from OpenLibrary API */

export interface OpenLibraryData {
  url?: string;
  key?: string;
  title?: string;
  authors?: Author[];
  identifiers: Identifiers;
  publishers?: Publisher[];
  publish_date?: string;
  subjects?: Subject[];
  ebooks?: Ebook[];
  cover?: Cover;
  pagination?: string;
  number_of_pages?: number;
}

export interface Author {
  url: string;
  name: string;
}

export interface Identifiers {
  isbn_10: string[];
  isbn_13?: string[];
  openlibrary: string[];
}

export interface Publisher {
  name: string;
}

export interface Subject {
  name: string;
  url: string;
}

export interface Ebook {
  preview_url: string;
  availability: string;
  formats: Formats;
  read_url: string;
}

export interface Formats {
  pdf: Pdf;
  epub: Epub;
  text: Text;
}

export interface Pdf {
  url: string;
}

export interface Epub {
  url: string;
}

export interface Text {
  url: string;
}

export interface Cover {
  small: string;
  medium: string;
  large: string;
}

/* ---------------------------------------- */

/* JSON response from Google Books API */

export interface Root {
  kind: string;
  totalItems: number;
  items: Item[];
}

export interface Item {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo: SearchInfo;
}

export interface VolumeInfo {
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories: string[];
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: EpubG;
  pdf: PdfG;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface EpubG {
  isAvailable: boolean;
}

export interface PdfG {
  isAvailable: boolean;
}

export interface SearchInfo {
  textSnippet: string;
}

/* ---------------------------------------- */

/* Types & Interfaces for App */

// Interface for the object for a NYT Best Sellers category card that will be on the home page
export interface nyTimesHomePageListObj {
  listName: string;
  books: BookObjNYT[];
}

// Interface for the object for a NYT Best Sellers book that will be on the home page
export interface BookObjNYT {
  author: string;
  imageSource: string;
  isbn: string;
  title: string;
}

// Interface for the basic fundamental book object to display on the UI
export interface BookObj {
  author: string | null;
  imageSource: string | null;
  isbn: string;
  numberOfPages: null | string;
  datePublished: null | string;
  publisher: null | string;
  title: string | null;
  link: string | null;
  location: LibraryLocation;
}

export type LibraryLocation = "booksDone" | "booksInProgress" | "booksToRead" | "not-in-library";

// Interface for custom event to update library numbers in nav section
export interface LibButtonPressedEventDetails {
  totalBooksToRead: () => number;
  totalBooksDone: () => number;
  totalBooksInProgress: () => number;
}

// Interface for data in the sub-lib-card component
export interface SubLibCardObject {
  title: string;
  location: LibraryLocation;
  books: BookObj[];
}

/* ---------------------------------------- */

/* Interface for State Object */

export interface State {
  viewedBook: BookObj | "No result";
  search: {
    query: string;
    result: BookObj | "No result" | null;
  };
  nyTimesBestSeller: nyTimesHomePageListObj[];
  libraryBooks: BookObj[];
  nonLibraryBooks: BookObj[];
  locations: LibraryLocation[];
}

/* ---------------------------------------- */
