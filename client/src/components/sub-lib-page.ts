import type { BookObj } from "../types";
import type BookObjCard from "../components/book-obj-card";
import { state, getLocalStorage, setLocalStorage } from "../model";
import "../components/book-obj-card";

export default class SubLibPage extends HTMLElement {
  _data!: BookObj[];

  constructor() {
    super();
  }

  get data(): BookObj[] {
    return this._data;
  }

  set data(data: BookObj[]) {
    this._data = data;
  }

  connectedCallback(): void {
    getLocalStorage();

    this.getSubLibraryFromURLSearchParams();
  }

  disconnectedCallback(): void {
    setLocalStorage();
  }

  getSubLibraryFromURLSearchParams(): void {
    this.innerHTML = `<div class="book-page"><h1>Loading...</h1></div>`;

    const searchParams = new URLSearchParams(window.location.search);
    const subLibrary = searchParams.get("q");

    if (subLibrary === null) {
      this.renderForNullSubLibrary();
      return;
    }

    const qIsAValidLocation = state.locations.some((loc) => loc === subLibrary);

    if (!qIsAValidLocation) {
      this.renderForInvalidSubLibrary();
      return;
    }

    this.data = state.libraryBooks.filter((book) => book.location === subLibrary);
    this.render(subLibrary);

    const allBookObjCard: NodeListOf<BookObjCard> = document.querySelectorAll("book-obj-card");

    if (allBookObjCard.length === 0) {
      return;
    }

    for (let i = 0; i < allBookObjCard.length; i++) {
      allBookObjCard[i].data = this.data[i];
    }
  }

  renderForNullSubLibrary = (): void => {
    this.innerHTML = `
      <div class="sub-lib-page-error">
        <h1>Invalid Page URL</h1>
        <p>Sorry, this is an invalid page URL.</p>
      </div>
    `;
  };

  renderForInvalidSubLibrary = (): void => {
    this.innerHTML = `
      <div class="sub-lib-page-error">
        <h1>Invalid Sub-Library Location</h1>
        <p>Sorry, this is an invalid sub-library.</p>
      </div>
    `;
  };

  render(libPar: string): void {
    this.innerHTML = this.getMarkup(libPar);
  }

  getMarkup(libPar: string): string {
    if (this.data.length === 0) {
      return `
    <div class="sub-lib-page-empty">
      <h1>No Books Here</h1>
      <p>There are currently no books here. Come back when it isn't empty 😀</p>
    </div>
        `;
    }

    return `
    <div class="sub-lib-page">
      <h1>${libPar === "booksInProgress" ? "In Progress" : libPar === "booksToRead" ? "To Read" : "Done"}</h1>
      ${this.data.map((book) => "<book-obj-card></book-obj-card>").join("")}
    </div>
    `;
  }
}

customElements.define("sub-lib-page", SubLibPage);
