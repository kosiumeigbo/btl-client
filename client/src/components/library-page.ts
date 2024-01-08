import type SubLibCard from "./sub-lib-card";
import { state, getLocalStorage, setLocalStorage } from "../model";
import "./sub-lib-card";

export default class LibraryPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    getLocalStorage();

    this.render();

    const subLibCards: NodeListOf<SubLibCard> = document.querySelectorAll("sub-lib-card");
    if (subLibCards.length !== 0 || subLibCards !== null) {
      subLibCards[0].data = {
        title: "Books In Progress",
        location: "booksInProgress",
        books: state.libraryBooks.filter((book) => book.location === "booksInProgress")
      };

      subLibCards[1].data = {
        title: "Books To Read",
        location: "booksToRead",
        books: state.libraryBooks.filter((book) => book.location === "booksToRead")
      };

      subLibCards[2].data = {
        title: "Books Done",
        location: "booksDone",
        books: state.libraryBooks.filter((book) => book.location === "booksDone")
      };
    }
  }

  disconnectedCallback(): void {
    setLocalStorage();
  }

  render(): void {
    this.outerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
  <div class="library-page">
    <h1>Library</h1>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
  </div>
    `;
  }
}

customElements.define("library-page", LibraryPage);
