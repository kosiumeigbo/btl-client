import type { BookObj, LibraryLocation, LibButtonPressedEventDetails } from "../types";
import { addToLibraryBtnIsPressed, state } from "../model";
import bookImage from "url:../assets/images/generic-book.png";

export default class BookObjCard extends HTMLElement {
  _data!: BookObj;

  constructor() {
    super();
  }

  get data(): BookObj {
    return this._data;
  }

  set data(data: BookObj) {
    this._data = data;
    this.render();
  }

  connectedCallback(): void {
    this.addEventListener("click", (e) => {
      this.btnPressed(e);
    });
  }

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

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getLibraryButtonsMarkUp(): string {
    if (this._data.location === "booksInProgress") {
      return `
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> In Progress
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead">
          <i class="fa-solid fa-circle-plus"></i> To Read
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone">
          <i class="fa-solid fa-circle-plus"></i> Done
        </button>
        `;
    }

    if (this._data.location === "booksToRead") {
      return `
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress">
          <i class="fa-solid fa-circle-plus"></i> In Progress
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> To Read
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone">
          <i class="fa-solid fa-circle-plus"></i> Done
        </button>
      `;
    }

    if (this._data.location === "booksDone") {
      return `
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress">
          <i class="fa-solid fa-circle-plus"></i> In Progress
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead">
          <i class="fa-solid fa-circle-plus"></i> To Read
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> Done
        </button>
        `;
    }

    return `
      <button data-isbn="${this._data.isbn}" data-library="booksInProgress">
        <i class="fa-solid fa-circle-plus"></i> In Progress
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksToRead">
        <i class="fa-solid fa-circle-plus"></i> To Read
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksDone">
        <i class="fa-solid fa-circle-plus"></i> Done
      </button>
        `;
  }

  getMarkUp(): string {
    return `
  <div class="book-obj-card" style="margin-bottom: 100px">
    <div class="book-obj-card__img">
      <a href="/book?isbn=${this._data.isbn}">
        <img src="${this._data.imageSource ?? bookImage}" alt="${this._data.title} by ${this._data.author}" />
      </a>
    </div>
    <div class="book-obj-card__info">
      <h2>${this._data.title ?? "N/A"}</h2>
      <p>${this._data.author ?? "N/A"}</p>
      <div>
        ${this.getLibraryButtonsMarkUp()}
      </div>
    </div>
    <a href="/book?isbn=${this._data.isbn}">
      Go to book page &nbsp; <i class="fa-solid fa-arrow-right-from-bracket"></i>
    </a>
  </div>
    `;
  }
}

customElements.define("book-obj-card", BookObjCard);
