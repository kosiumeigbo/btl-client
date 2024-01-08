import type { nyTimesHomePageListObj } from "../types";
import type NytBookCard from "./nyt-book-card";
import "./nyt-book-card";

export default class NytCategoryCard extends HTMLElement {
  _data!: nyTimesHomePageListObj;

  constructor() {
    super();
    this.classList.add("nyt-category-card");
  }

  get data(): nyTimesHomePageListObj {
    return this._data;
  }

  set data(data) {
    if (this._data !== data) {
      this._data = data;
      this.render();

      const allBookCardEls = this.querySelectorAll("nyt-book-card");
      allBookCardEls.forEach((book, index) => {
        (book as NytBookCard).data = this.data.books[index];
      });
    }
  }

  connectedCallback(): void {}

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
        <h2>${this._data.listName}</h2>
        <div>
        ${this._data.books
          .map((bk) => {
            return `<nyt-book-card></nyt-book-card>`;
          })
          .join("")}
        </div>
      `;
  }
}

customElements.define("nyt-category-card", NytCategoryCard);
