/* For JSON response for HomePage */
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
/// /// /// /// /// /// /// /// /// ///

export interface BookObj {
  author: string;
  imageSource: string;
  isbn: number;
  numberOfPages: null | number;
  yearPublished: null | number;
  publisher: string;
  title: string;
  link: string;
  isToRead: boolean;
  isDone: boolean;
  isInProgress: boolean;
}

export interface nyTimesHomePageListObj {
  listName: string;
  books: BookObj[];
}
/* ---------------------------------------- */

export interface State {
  nyTimesBestSeller: nyTimesHomePageListObj[];
  library: {
    booksDone: BookObj[];
    booksInProgress: BookObj[];
    booksToRead: BookObj[];
  };
}
