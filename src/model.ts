import type { State, BestSellersData, BookObjNYT, BookObj, OpenLibraryData } from "./types";
import { NY_TIMES_API_KEY, NY_TIMES_BEST_SELLERS_URL } from "./config";

export const state: State = {
  nyTimesBestSeller: [],
  search: {
    query: "",
    result: null
  },
  library: {
    booksDone: [],
    booksInProgress: [],
    booksToRead: []
  }
};

export const updateStateNyTimesBestSeller = async function (): Promise<void> {
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
          isbn: Number(book.primary_isbn13),
          title: book.title
        };
      });

      return { listName: listArea, books: booksInArea };
    });
    console.log(state.nyTimesBestSeller);
  } catch (e) {
    (e as Error).message = "Could not get data from server";
// To navigate the NYTimes API limit, this function runs periodically and updates state's nyTimesBestSeller array.
// The only downside is that if it returns an empty array, it has to wait a long time to get new data.
// The function also runs immediately so that there is always something happening to the state's nyTimesBestSeller array
const keepUpdatingStateNyTimesBestSeller = async function (): Promise<void> {
  await updateStateNyTimesBestSeller();

  setInterval(updateStateNyTimesBestSeller, NY_TIMES_API_CALL_LIMIT_SECONDS);
};
void keepUpdatingStateNyTimesBestSeller();

// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's search object, else returns an Error
export const updateStateSearchResult = async function (isbn: string): Promise<undefined | Error> {
  try {
    state.search.query = isbn;

    const bookIsInDone = state.library.booksDone.find((book) => book.isbn === Number(isbn));
    const bookIsInProgress = state.library.booksInProgress.find((book) => book.isbn === Number(isbn));
    const bookIsInToRead = state.library.booksToRead.find((book) => book.isbn === Number(isbn));

    if (bookIsInDone !== undefined && bookIsInProgress === undefined && bookIsInToRead === undefined)
      state.search.result = bookIsInDone;
    else if (bookIsInDone === undefined && bookIsInProgress !== undefined && bookIsInToRead === undefined)
      state.search.result = bookIsInProgress;
    else if (bookIsInDone === undefined && bookIsInProgress === undefined && bookIsInToRead !== undefined)
      state.search.result = bookIsInToRead;
    else {
      const openLibrarySearchResult = await getBookObjFromOpenLibrary(isbn);
      if (openLibrarySearchResult instanceof Error) throw openLibrarySearchResult;
      state.search.result = openLibrarySearchResult;
    }
  } catch (e) {
    return e as Error;
  }
};

// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's viewed book into a BookObj or "No result", else returns an Error
export const updateStateViewedBook = async function (isbn: string): Promise<undefined | Error> {
  try {
    const bookIsInDone = state.library.booksDone.find((book) => book.isbn === Number(isbn));
    const bookIsInProgress = state.library.booksInProgress.find((book) => book.isbn === Number(isbn));
    const bookIsInToRead = state.library.booksToRead.find((book) => book.isbn === Number(isbn));

    if (bookIsInDone !== undefined && bookIsInProgress === undefined && bookIsInToRead === undefined)
      state.viewedBook = bookIsInDone;
    else if (bookIsInDone === undefined && bookIsInProgress !== undefined && bookIsInToRead === undefined)
      state.viewedBook = bookIsInProgress;
    else if (bookIsInDone === undefined && bookIsInProgress === undefined && bookIsInToRead !== undefined)
      state.viewedBook = bookIsInToRead;
    else {
      const openLibrarySearchResult = await getBookObjFromOpenLibrary(isbn);
      if (openLibrarySearchResult instanceof Error) throw openLibrarySearchResult;
      state.viewedBook = openLibrarySearchResult;
      console.log(openLibrarySearchResult);
    }
  } catch (e) {
    return e as Error;
  }
};

// Function that accepts isbn as string, goes through Open Library to get the book
// and returns either a BookObj object or "No result", else returns an Error
export const getBookObjFromOpenLibrary = async function (isbn: string): Promise<BookObj | "No result" | Error> {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!res.ok || res.status !== 200) throw new Error();

    const dataOpenLibrary = await res.json();
    console.log(dataOpenLibrary);

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
    const bkIsbn = Number(bkIsbnArr[0]);

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
      yearPublished: bkYearPublished,
      publisher: bkPublisher,
      title: bkTitle,
      link: bkLink,
      isToRead: false,
      isDone: false,
      isInProgress: false
    };
    console.log(objToReturn);

    return objToReturn;
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    return e as Error;
  }
};
