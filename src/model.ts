import type { State, BestSellersData, BookObj, nyTimesHomePageListObj } from "./types";
import { NY_TIMES_API_KEY, NY_TIMES_BEST_SELLERS_URL } from "./config";

export const state: State = {
  nyTimesBestSeller: [],
  library: {
    booksDone: [],
    booksInProgress: [],
    booksToRead: []
  }
};

export const getNyTimesBestSellers = async function (): Promise<nyTimesHomePageListObj[] | Error> {
  try {
    const res = await fetch(`${NY_TIMES_BEST_SELLERS_URL}?api-key=${NY_TIMES_API_KEY}`);
    if (!res.ok || res.status !== 200) throw new Error();

    const overviewBestSellers: BestSellersData[] = (await res.json()).results.lists;

    state.nyTimesBestSeller = overviewBestSellers.map((obj) => {
      const listArea: string = obj.list_name;
      const booksInArea: BookObj[] = obj.books.map((book) => {
        return {
          author: book.author,
          imageSource: book.book_image,
          isbn: Number(book.primary_isbn13),
          numberOfPages: null,
          yearPublished: null,
          publisher: book.publisher,
          title: book.title,
          link: `https://openlibrary.org/isbn/${book.primary_isbn13}`,
          isDone: false,
          isInProgress: false,
          isToRead: false
        };
      });

      return { listName: listArea, books: booksInArea };
    });

    const objArray = state.nyTimesBestSeller;
    return objArray;
  } catch (e) {
    (e as Error).message = "Could not get data from server";
    throw e as Error;
  }
};
