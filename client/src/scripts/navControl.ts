import type { LibButtonPressedEventDetails } from "../types";
import { state, getLocalStorage } from "../model";

document.addEventListener("DOMContentLoaded", () => {
  const elBooksToRead = document.getElementById("books-to-read-total");
  const elBooksInProgress = document.getElementById("books-in-progress-total");
  const elBooksDone = document.getElementById("books-done-total");
  const elLibraryTotal = document.getElementById("library-total");

  if (elBooksToRead !== null && elBooksInProgress !== null && elBooksDone !== null && elLibraryTotal !== null) {
    document.addEventListener("lib-btn-pressed", (e) => {
      const detail = (e as CustomEvent<LibButtonPressedEventDetails>).detail;
      console.log(detail);

      elBooksToRead.textContent = detail.totalBooksToRead().toString();
      elBooksInProgress.textContent = detail.totalBooksInProgress().toString();
      elBooksDone.textContent = detail.totalBooksDone().toString();
      elLibraryTotal.textContent = (
        detail.totalBooksToRead() +
        detail.totalBooksInProgress() +
        detail.totalBooksDone()
      ).toString();
    });

    getLocalStorage();

    const totalBooksToRead = state.libraryBooks.filter((book) => book.location === "booksToRead").length;
    const totalBooksInProgress = state.libraryBooks.filter((book) => book.location === "booksInProgress").length;
    const totalBooksDone = state.libraryBooks.filter((book) => book.location === "booksDone").length;
    const totalLibraryBooks = totalBooksToRead + totalBooksInProgress + totalBooksDone;

    elBooksToRead.textContent = totalBooksToRead.toString();
    elBooksInProgress.textContent = totalBooksInProgress.toString();
    elBooksDone.textContent = totalBooksDone.toString();
    elLibraryTotal.textContent = totalLibraryBooks.toString();
  }
});

/*
const elBooksToRead = document.getElementById("books-to-read-total");
const elBooksInProgress = document.getElementById("books-in-progress-total");
const elBooksDone = document.getElementById("books-done-total");
const elLibraryTotal = document.getElementById("library-total");

if (elBooksToRead !== null && elBooksInProgress !== null && elBooksDone !== null && elLibraryTotal !== null) {
  document.addEventListener("lib-btn-pressed", (e) => {
    const detail = (e as CustomEvent<LibButtonPressedEventDetails>).detail;
    console.log(detail);

    elBooksToRead.textContent = detail.totalBooksToRead().toString();
    elBooksInProgress.textContent = detail.totalBooksInProgress().toString();
    elBooksDone.textContent = detail.totalBooksDone().toString();
    elLibraryTotal.textContent = (
      detail.totalBooksToRead() +
      detail.totalBooksInProgress() +
      detail.totalBooksDone()
    ).toString();
  });
}
*/
