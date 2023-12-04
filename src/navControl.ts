import type { LibButtonPressedEventDetails } from "./types";

const elBooksToRead = document.getElementById("books-to-read-total");
const elBooksInProgress = document.getElementById("books-in-progress-total");
const elBooksDone = document.getElementById("books-done-total");

if (elBooksToRead !== null && elBooksInProgress !== null && elBooksDone !== null) {
  document.addEventListener("lib-btn-pressed", (e) => {
    const detail = (e as CustomEvent<LibButtonPressedEventDetails>).detail;
    console.log(detail);

    elBooksToRead.textContent = detail.totalBooksToRead().toString();
    elBooksInProgress.textContent = detail.totalBooksInProgress().toString();
    elBooksDone.textContent = detail.totalBooksDone().toString();
  });
}
