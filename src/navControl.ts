import type { LibButtonPressedEventDetails } from "./types";

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
