import type { BookObj } from "../types";

export default class BookPage extends HTMLElement {
  data!: BookObj;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  btnPressed(e: Event): void {
    const libButton = (e.target as HTMLElement).closest("[data-library][data-isbn]");
    console.log(libButton);

    if (libButton !== null) {
      const isbn = (libButton as HTMLElement).dataset.isbn;
      const btnLibrary = (libButton as HTMLElement).dataset.library;
      console.log(isbn, btnLibrary);

      if (typeof isbn === "string" && typeof btnLibrary === "string") {
        const updatedCardState = addToLibraryBtnIsPressed(btnLibrary as LibraryLocation, isbn);
        console.log(updatedCardState);

        if (!(updatedCardState instanceof Error)) {
          this.data = updatedCardState;
        }
      }

      const libBtnPressed = new CustomEvent<LibButtonPressedEventDetails>("lib-btn-pressed", {
        bubbles: true,
        detail: {
          totalBooksDone: () => state.libraryBooks.filter((book) => book.location === "booksDone").length,
          totalBooksInProgress: () => state.libraryBooks.filter((book) => book.location === "booksInProgress").length,
          totalBooksToRead: () => state.libraryBooks.filter((book) => book.location === "booksToRead").length
        }
      });
      this.dispatchEvent(libBtnPressed);
    }
  }
  }

  render(): string {
    return ``;
  }
}

customElements.define("book-page", BookPage);
