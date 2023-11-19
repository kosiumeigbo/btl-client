import type { State, BestSellersData, BookObjNYT, OpenLibraryData, LibraryLocation, BookObj } from "./types";
import { NY_TIMES_API_KEY, NY_TIMES_BEST_SELLERS_URL, NY_TIMES_API_CALL_LIMIT_SECONDS } from "./config";

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

      return updatedBk;
    }

    bookLibrary.location = btnDataset;
    state.libraryBooks.splice(bookLibraryIndex, 1, bookLibrary);
    return bookLibrary;
  }

  const bookNonLibraryIndex = state.nonLibraryBooks.findIndex((bk) => bk.isbn === isbn);
  const bookNonLibrary = state.nonLibraryBooks.find((bk) => bk.isbn === isbn);

  if (bookNonLibraryIndex !== -1 && bookNonLibrary !== undefined) {
    const [updatedBk] = state.nonLibraryBooks.splice(bookNonLibraryIndex, 1);
    updatedBk.location = btnDataset;

    state.libraryBooks.push(updatedBk);

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
          isbn: Number(book.primary_isbn13),
          title: book.title
        };
      });

      return { listName: listArea, books: booksInArea };
    });
    console.log(state.nyTimesBestSeller);
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
const updateStateSearchResult = async function (isbn: string = state.search.query): Promise<undefined | Error> {
  try {
    if (state.search.query === "") {
      state.search.result = null;
      return;
    }
    state.search.query = isbn;

    const bookInLibrary = state.libraryBooks.find((book) => book.isbn === Number(isbn));
    const bookNotInLibrary = state.nonLibraryBooks.find((book) => book.isbn === Number(isbn));

    if (bookInLibrary !== undefined) {
      state.search.result = bookInLibrary;
    } else if (bookNotInLibrary !== undefined) {
      state.search.result = bookNotInLibrary;
    } else {
      const openLibrarySearchResult = await getBookObjFromOpenLibrary(isbn);
      if (openLibrarySearchResult instanceof Error) throw openLibrarySearchResult;
      state.search.result = openLibrarySearchResult;

      if (typeof openLibrarySearchResult !== "string") {
        state.nonLibraryBooks.push(openLibrarySearchResult);
      }
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
    const bookInLibrary = state.libraryBooks.find((book) => book.isbn === Number(isbn));
    const bookNotInLibrary = state.nonLibraryBooks.find((book) => book.isbn === Number(isbn));

    if (bookInLibrary !== undefined) {
      state.viewedBook = bookInLibrary;
    } else if (bookNotInLibrary !== undefined) {
      state.viewedBook = bookNotInLibrary;
    } else {
      const openLibrarySearchResult = await getBookObjFromOpenLibrary(isbn);
      if (openLibrarySearchResult instanceof Error) throw openLibrarySearchResult;
      state.viewedBook = openLibrarySearchResult;

      if (typeof openLibrarySearchResult !== "string") {
        state.nonLibraryBooks.push(openLibrarySearchResult);
      }
    }
  } catch (e) {
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
      location: "not-in-library"
    };
    console.log(objToReturn);

    return objToReturn;
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    return e as Error;
  }
};

export {
  state,
  getBookObjFromOpenLibrary,
  addToLibraryBtnIsPressed,
  updateStateNyTimesBestSeller,
  updateStateSearchResult,
  updateStateViewedBook
};
