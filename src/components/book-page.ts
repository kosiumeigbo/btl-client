import type { BookObj, LibraryLocation, LibButtonPressedEventDetails } from "../types";
import { state, addToLibraryBtnIsPressed, updateStateViewedBook, getLocalStorage, setLocalStorage } from "../model";
import bookImage from "url:../assets/images/generic-book.png";

export default class BookPage extends HTMLElement {
  _data!: BookObj | "No result";

  constructor() {
    super();
  }

  get data(): BookObj | "No result" {
    return this._data;
  }

  set data(data: BookObj | "No result") {
    this._data = data;
  }

  connectedCallback(): void {
    getLocalStorage();

    this.getBookObjFromISBN();

    this.addEventListener("click", (e) => {
      this.btnPressed(e);
    });
  }

  disconnectedCallback(): void {
    setLocalStorage();
  }

  async getBookObjFromISBN(): Promise<undefined> {
    this.innerHTML = `<div class="book-page"><h1>Loading...</h1></div>`;

    const searchParams = new URLSearchParams(window.location.search);
    const isbn = searchParams.get("isbn");

    if (isbn === null) {
      this.renderForNullISBN();
      return;
    }

    try {
      const getBookObjFromISBN = await updateStateViewedBook(isbn);

      if (getBookObjFromISBN instanceof Error) {
        throw getBookObjFromISBN;
      }

      this.data = state.viewedBook;
      this.render();
    } catch (e) {
      this.renderForErrorInISBNSearch(e as Error);
    }
  }

  renderForNullISBN = (): void => {
    this.innerHTML = `
      <div class="book-page-error">
        <h1>Invalid Page URL</h1>
        <p>Sorry, this is an invalid page URL.</p>
      </div>
    `;
  };

  renderForErrorInISBNSearch = (par: Error): void => {
    this.innerHTML = `
      <div class="book-page-error">
        <h1>Server Error</h1>
        <p>${par.message}</p>
      </div>
    `;
  };

  render(): void {
    this.innerHTML = this.getMarkUp();
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
          this.render();
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

  getLibraryButtonsMarkUp(param: BookObj): string {
    if (param.location === "booksInProgress") {
      return `
        <button data-isbn="${param.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
        </button>
        `;
    }

    if (param.location === "booksToRead") {
      return `
        <button data-isbn="${param.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
        </button>
      `;
    }

    if (param.location === "booksDone") {
      return `
        <button data-isbn="${param.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${param.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-check"></i>
        </button>
        `;
    }

    return `
      <button data-isbn="${param.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
      </button>
      <button data-isbn="${param.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
      </button>
      <button data-isbn="${param.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
      </button>
        `;
  }

  getMarkUp(): string {
    if (this.data === "No result") {
      return `
      <div class="book-page-no-result">
        <h1>No Result</h1>
        <p>Sorry, there is no result for this ISBN.</p>
      </div>
    `;
    } else {
      return `
    <div class="book-page">
      <div class="book-page__title">
        <h1>${this.data.title ?? "N/A"}</h1>
        <p>by <span style="text-decoration: underline; font-style: italic">${this.data.author ?? "N/A"}</span></p>
      </div>
      <div class="book-page__panel">
        <div class="image"><img src="${this.data.imageSource ?? bookImage}" alt="${this.data.title ?? "N/A"} by ${
          this.data.author ?? "N/A"
        }" /></div>
        <div class="add-to-lib-buttons">
          ${this.getLibraryButtonsMarkUp(this.data)}
        </div>
        ${
          this.data.link !== null
            ? `<a class="link" target="_blank" href="${this.data.link}">Go to main site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
            : ""
        }
      </div>
      <div class="book-page__info">
        <div class="book-page__info__title">
          <h1>${this.data.title ?? "N/A"}</h1>
          <p>by <span style="text-decoration: underline; font-style: italic">${this.data.author ?? "N/A"}</span></p>
        </div>
        <div>
          <h3>ISBN</h3>
          <p>${this.data.isbn}</p>
        </div>
        <div class="book-page__info__grid">
          <div>
            <h3>No. of pages</h3>
            <p>${this.data.numberOfPages ?? "N/A"}</p>
          </div>
          <div>
            <h3>Date published</h3>
            <p>${this.data.datePublished ?? "N/A"}</p>
          </div>
          <div>
            <h3>Publisher</h3>
            <p>${this.data.publisher ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
      `;
    }
  }
}

customElements.define("book-page", BookPage);
