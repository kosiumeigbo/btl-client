import type {
  State,
  BestSellersData,
  BookObjNYT,
  OpenLibraryData,
  LibraryLocation,
  BookObj,
  Item,
  Root
} from "./types";
import {
  NY_TIMES_API_KEY,
  NY_TIMES_BEST_SELLERS_URL,
  NY_TIMES_API_CALL_LIMIT_SECONDS,
  GOOGLE_BOOKS_API_KEY
} from "./config";

const state: State = {
  viewedBook: "No result",
  nyTimesBestSeller: [],
  search: {
    query: "",
    result: null
  },
  libraryBooks: [],
  nonLibraryBooks: [],
  locations: ["booksDone", "booksInProgress", "booksToRead"]
};

// Function resets the state.search properties to their default values
const resetStateSearch = function (): void {
  state.search.query = "";
  state.search.result = null;
};

// Function that saves the state.libraryBooks array to local storage
const setLibraryBooksInLocalStorage = function (): void {
  localStorage.setItem("libraryBooks", JSON.stringify(state.libraryBooks));
};

// Function that saves the state.nonLibraryBooks array to local storage
const setNonLibraryBooksInLocalStorage = function (): void {
  localStorage.setItem("nonLibraryBooks", JSON.stringify(state.nonLibraryBooks));
};

// Function that runs both setLibraryBooksInLocalStorage and setNonLibraryBooksInLocalStorage functions
const setLocalStorage = function (): void {
  setLibraryBooksInLocalStorage();
  setNonLibraryBooksInLocalStorage();
};

// Function that gets the libraryBooks array from local storage
// and saves it to state.libraryBooks
const getLibraryBooksFromLocalStorage = function (): void {
  const libraryBooks = JSON.parse(localStorage.getItem("libraryBooks") ?? "[]");
  state.libraryBooks = libraryBooks;
};

// Function that gets the nonLibraryBooks array from local storage
// and saves it to state.nonLibraryBooks
const getNonLibraryBooksFromLocalStorage = function (): void {
  const nonLibraryBooks = JSON.parse(localStorage.getItem("nonLibraryBooks") ?? "[]");
  state.nonLibraryBooks = nonLibraryBooks;
};

// Function that runs both getLibraryBooksInLocalStorage and getNonLibraryBooksInLocalStorage functions
const getLocalStorage = function (): void {
  getLibraryBooksFromLocalStorage();
  getNonLibraryBooksFromLocalStorage();
};

// Function takes in the isbn from the data-isbn property and the btnLibrary param is from the data-library property
// on the pressed button. It returns either the
const addToLibraryBtnIsPressed = function (btnDataset: LibraryLocation, isbn: string): Error | BookObj {
  const bookLibraryIndex = state.libraryBooks.findIndex((bk) => bk.isbn === isbn);
  const bookLibrary = state.libraryBooks.find((bk) => bk.isbn === isbn);

  if (bookLibraryIndex !== -1 && bookLibrary !== undefined) {
    if (bookLibrary.location === btnDataset) {
      const [updatedBk] = state.libraryBooks.splice(bookLibraryIndex, 1);

      updatedBk.location = "not-in-library";
      state.nonLibraryBooks.push(updatedBk);

      setLocalStorage();

      return updatedBk;
    }

    bookLibrary.location = btnDataset;
    state.libraryBooks.splice(bookLibraryIndex, 1, bookLibrary);

    setLocalStorage();

    return bookLibrary;
  }

  const bookNonLibraryIndex = state.nonLibraryBooks.findIndex((bk) => bk.isbn === isbn);
  const bookNonLibrary = state.nonLibraryBooks.find((bk) => bk.isbn === isbn);

  if (bookNonLibraryIndex !== -1 && bookNonLibrary !== undefined) {
    const [updatedBk] = state.nonLibraryBooks.splice(bookNonLibraryIndex, 1);
    updatedBk.location = btnDataset;

    state.libraryBooks.push(updatedBk);

    setLocalStorage();

    return updatedBk;
  }

  return new Error();
};

// Function that gets the best sellers list from NYTimes, converts the results acoordingly and
// saves them as state's nyTimesBestSeller array.
// If there's an error, then state's nyTimesBestSeller array becomes empty.
const updateStateNyTimesBestSeller = async function (): Promise<void> {
  try {
    const res = await fetch(`${NY_TIMES_BEST_SELLERS_URL}?api-key=${NY_TIMES_API_KEY}`);
    if (!res.ok || res.status !== 200) throw new Error();

    const overviewBestSellers: BestSellersData[] = (await res.json()).results.lists;

    state.nyTimesBestSeller = overviewBestSellers.map((obj) => {
      const listArea: string = obj.list_name;
      const booksInArea: BookObjNYT[] = obj.books.map((book) => {
        return {
          author: book.author,
          imageSource: book.book_image,
          isbn: book.primary_isbn13,
          title: book.title
        };
      });

      return { listName: listArea, books: booksInArea };
    });
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    state.nyTimesBestSeller = [];
  }
};

// To navigate the NYTimes API limit, this function runs periodically and updates state's nyTimesBestSeller array.
// The only downside is that if it returns an empty array, it has to wait a long time to get new data.
// The function also runs immediately so that there is always something happening to the state's nyTimesBestSeller array
const keepUpdatingStateNyTimesBestSeller = async function (): Promise<void> {
  await updateStateNyTimesBestSeller();

  setInterval(updateStateNyTimesBestSeller, NY_TIMES_API_CALL_LIMIT_SECONDS);
};
keepUpdatingStateNyTimesBestSeller();

// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's search object, else returns an Error.
// Will run when SearchPage is first loaded and also when the user presses the search button
const updateStateSearchResult = async function (isbn: string): Promise<undefined | Error> {
  try {
    state.search.query = isbn;

    const bookSearchResult = await getBookObj(isbn);
    if (bookSearchResult instanceof Error) throw bookSearchResult;

    if (typeof bookSearchResult === "string") {
      state.search.result = bookSearchResult;
      return;
    }

    const bookInLibrary = state.libraryBooks.find((book) => book.isbn === bookSearchResult.isbn);
    const bookNotInLibrary = state.nonLibraryBooks.find((book) => book.isbn === bookSearchResult.isbn);

    if (bookInLibrary !== undefined) {
      state.search.result = bookInLibrary;
    } else if (bookNotInLibrary !== undefined) {
      state.search.result = bookNotInLibrary;
    } else {
      state.search.result = bookSearchResult;
      state.nonLibraryBooks.push(bookSearchResult);

      setLocalStorage();
    }
  } catch (e) {
    return e as Error;
  }
};

// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's viewed book into a BookObj or "No result", else returns an Error
// Will run when BookPage is first loaded. The isbn param is taken from the isbn query parameter on the URL
const updateStateViewedBook = async function (isbn: string): Promise<undefined | Error> {
  try {
    const bookSearchResult = await getBookObj(isbn);
    if (bookSearchResult instanceof Error) throw bookSearchResult;

    if (bookSearchResult === "No result") {
      state.viewedBook = bookSearchResult;
      return;
    }

    const bookInLibrary = state.libraryBooks.find((book) => book.isbn === bookSearchResult.isbn);
    const bookNotInLibrary = state.nonLibraryBooks.find((book) => book.isbn === bookSearchResult.isbn);

    if (bookInLibrary !== undefined) {
      state.viewedBook = bookInLibrary;
    } else if (bookNotInLibrary !== undefined) {
      state.viewedBook = bookNotInLibrary;
    } else {
      state.viewedBook = bookSearchResult;
      state.nonLibraryBooks.push(bookSearchResult);

      setLocalStorage();
    }
  } catch (e) {
    return e as Error;
  }
};

// Function to get the book object from either Open Library or Google Books API
// Google Books API is the first choice, if it returns an error or "No result", then Open Library is used
const getBookObj = async function (isbn: string): Promise<BookObj | "No result" | Error> {
  try {
    const googleBooksSearchResult = await getBookObjFromGoogleBooks(isbn);

    if (googleBooksSearchResult instanceof Error || typeof googleBooksSearchResult === "string") {
      const openLibrarySearchResult = await getBookObjFromOpenLibrary(isbn);
      if (openLibrarySearchResult instanceof Error) throw openLibrarySearchResult;

      if (typeof openLibrarySearchResult === "string") {
        return openLibrarySearchResult;
      }

      return openLibrarySearchResult;
    }

    return googleBooksSearchResult;
  } catch (e: any) {
    return e as Error;
  }
};

// Function that accepts isbn as string, goes through Open Library to get the book
// and returns either a BookObj object or "No result", else returns an Error
const getBookObjFromOpenLibrary = async function (isbn: string): Promise<BookObj | "No result" | Error> {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!res.ok || res.status !== 200) throw new Error();

    const dataOpenLibrary = await res.json();

    if (Object.keys(dataOpenLibrary).length === 0) return "No result";

    const mainObject: OpenLibraryData = dataOpenLibrary[`ISBN:${isbn}`];

    // To get author(s)
    const bkAuthor =
      mainObject.authors
        ?.map((authObj) => {
          return authObj.name;
        })
        .join(", ") ?? null;

    // To get image source
    const bkImageSource = mainObject.cover?.large ?? null;

    // To get isbn
    const bkIsbnArr = mainObject.identifiers.isbn_13 ?? mainObject.identifiers.isbn_10;
    const bkIsbn = bkIsbnArr[0];

    // To get pages
    const bkPagesCheck = mainObject.number_of_pages ?? mainObject.pagination ?? null;
    const bkPages = typeof bkPagesCheck === "number" ? bkPagesCheck.toString() : bkPagesCheck;

    // To get year published
    const bkYearPublished = mainObject.publish_date ?? null;

    // To get publisher
    const bkPublisher = mainObject.publishers?.map((publ) => publ.name).join(", ") ?? null;

    // To get title
    const bkTitle = mainObject.title ?? null;

    // To get link for book
    const bkLink = mainObject.url ?? null;

    const objToReturn: BookObj = {
      author: bkAuthor,
      imageSource: bkImageSource,
      isbn: bkIsbn,
      numberOfPages: bkPages,
      datePublished: bkYearPublished,
      publisher: bkPublisher,
      title: bkTitle,
      link: bkLink,
      location: "not-in-library"
    };

    return objToReturn;
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    return e as Error;
  }
};

// Function that accepts isbn as string, goes through Google Books API to get the book
// and returns either a BookObj object or "No result", else returns an Error
const getBookObjFromGoogleBooks = async function (isbn: string): Promise<BookObj | "No result" | Error> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`);

    if (!res.ok || res.status !== 200) throw new Error();

    const dataGoogleBooks = (await res.json()) as Root;

    if (dataGoogleBooks.totalItems === 0) return "No result";

    const [mainObject]: Item[] = dataGoogleBooks.items;
    const { volumeInfo } = mainObject;

    // To get author(s)
    // const bkAuthor = mainObject.volumeInfo.authors?.join(", ") ?? null;
    const bkAuthor = volumeInfo.authors?.join(", ") ?? null;

    // To get image source
    // const bkImageSource = mainObject.volumeInfo.imageLinks?.thumbnail ?? null;
    const bkImageSource = volumeInfo.imageLinks?.thumbnail ?? volumeInfo.imageLinks?.smallThumbnail ?? null;

    // To get isbn
    // const bkIsbn = mainObject.volumeInfo.industryIdentifiers[0].identifier;
    const bkIsbn =
      volumeInfo.industryIdentifiers?.find((obj) => obj.type === "ISBN_13")?.identifier ??
      volumeInfo.industryIdentifiers?.find((obj) => obj.type === "ISBN_10")?.identifier ??
      "N/A";

    // To get pages
    // const bkPages = mainObject.volumeInfo.pageCount?.toString() ?? null;
    const bkPages = volumeInfo.pageCount === 0 ? null : volumeInfo.pageCount?.toString() ?? null;

    // To get year published
    // const bkYearPublished = mainObject.volumeInfo.publishedDate ?? null;
    const bkYearPublished = volumeInfo.publishedDate ?? null;

    // To get publisher
    // const bkPublisher = mainObject.volumeInfo.publisher ?? null;
    const bkPublisher = volumeInfo.publisher ?? null;

    // To get title
    // const bkTitle = mainObject.volumeInfo.title ?? null;
    const bkTitle = volumeInfo.title ?? null;

    // To get link for book
    const bkLink = mainObject.volumeInfo.previewLink ?? null;

    const objToReturn: BookObj = {
      author: bkAuthor,
      imageSource: bkImageSource,
      isbn: bkIsbn,
      numberOfPages: bkPages,
      datePublished: bkYearPublished,
      publisher: bkPublisher,
      title: bkTitle,
      link: bkLink,
      location: "not-in-library"
    };

    return objToReturn;
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    return e as Error;
  }
};

export {
  state,
  getBookObjFromOpenLibrary,
  getBookObjFromGoogleBooks,
  getBookObj,
  addToLibraryBtnIsPressed,
  updateStateNyTimesBestSeller,
  updateStateSearchResult,
  updateStateViewedBook,
  resetStateSearch,
  setLibraryBooksInLocalStorage,
  setNonLibraryBooksInLocalStorage,
  setLocalStorage,
  getLibraryBooksFromLocalStorage,
  getNonLibraryBooksFromLocalStorage,
  getLocalStorage
};
