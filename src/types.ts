/* JSON response from NYT Best Sellers API */

export type BestSellersData = {
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

type BookRes = {
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

type BuyLink = {
  name: string;
  url: string;
}

/* ---------------------------------------- */

/* JSON response from OpenLibrary API */

export type OpenLibraryData = {
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

export type Author = {
  url: string;
  name: string;
}

export type Identifiers = {
  isbn_10: string[];
  isbn_13?: string[];
  openlibrary: string[];
}

export type Publisher = {
  name: string;
}

export type Subject = {
  name: string;
  url: string;
}

export type Ebook = {
  preview_url: string;
  availability: string;
  formats: Formats;
  read_url: string;
}

export type Formats = {
  pdf: Pdf;
  epub: Epub;
  text: Text;
}

export type Pdf = {
  url: string;
}

export type Epub = {
  url: string;
}

export type Text = {
  url: string;
}

export type Cover = {
  small: string;
  medium: string;
  large: string;
}

/* ---------------------------------------- */

/* JSON response from Google Books API */

export type Root = {
  kind: string;
  totalItems: number;
  items: Item[];
}

export type Item = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo: SearchInfo;
}

export type VolumeInfo = {
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

export type IndustryIdentifier = {
  type: string;
  identifier: string;
}

export type ReadingModes = {
  text: boolean;
  image: boolean;
}

export type PanelizationSummary = {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export type ImageLinks = {
  smallThumbnail: string;
  thumbnail: string;
}

export type SaleInfo = {
  country: string;
  saleability: string;
  isEbook: boolean;
}

export type AccessInfo = {
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

export type EpubG = {
  isAvailable: boolean;
}

export type PdfG = {
  isAvailable: boolean;
}

export type SearchInfo = {
  textSnippet: string;
}

/* ---------------------------------------- */

/* Types & Interfaces for App */

// Interface for the object for a NYT Best Sellers category card that will be on the home page
export type nyTimesHomePageListObj = {
  listName: string;
  books: BookObjNYT[];
}

// Interface for the object for a NYT Best Sellers book that will be on the home page
export type BookObjNYT = {
  author: string;
  imageSource: string;
  isbn: string;
  title: string;
}

// Interface for the basic fundamental book object to display on the UI
export type BookObj = {
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
export type LibButtonPressedEventDetails = {
  totalBooksToRead: () => number;
  totalBooksDone: () => number;
  totalBooksInProgress: () => number;
}

// Interface for data in the sub-lib-card component
export type SubLibCardObject = {
  title: string;
  location: LibraryLocation;
  books: BookObj[];
}

/* ---------------------------------------- */

/* Interface for State Object */

export type State = {
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
