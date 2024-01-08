import type { SubLibCardObject } from "../types";
import type SubLibBookCard from "./sub-lib-book-card";
import "./sub-lib-book-card";

export default class SubLibCard extends HTMLElement {
  _data!: SubLibCardObject;

  constructor() {
    super();
  }

  get data(): SubLibCardObject {
    return this._data;
  }

  set data(data: SubLibCardObject) {
    if (this._data !== data) {
      this._data = data;
      this.render();

      const subLibBookCards: NodeListOf<SubLibBookCard> = document.querySelectorAll("sub-lib-book-card");
      if (subLibBookCards.length !== 0 || subLibBookCards !== null) {
        subLibBookCards.forEach((subLibBookCard: SubLibBookCard, index: number) => {
          subLibBookCard.data = this.data.books[index];
        });
      }
    }
  }

  render(): void {
    this.outerHTML = this.getMarkUp();
  }

  checkBooks(): string {
    if (this.data.books.length === 0) {
      return `
      <div class="sub-lib-card__empty">
        <p>You have not added any book here. Add books to see them here! 🙂</p>
      </div>
      `;
    } else if (this.data.books.length >= 5) {
      let str: string = "";

      for (let i = 0; i < 5; i++) {
        str += `<sub-lib-book-card></sub-lib-book-card>`;
      }

      return `
      <div class="sub-lib-card__books">
        ${str}
      </div>
      `;
    } else {
      let str: string = "";

      for (let i = 0; i < this.data.books.length; i++) {
        str += `<sub-lib-book-card></sub-lib-book-card>`;
      }

      return `
      <div class="sub-lib-card__books">
        ${str}
      </div>
      `;
    }
  }

  getMarkUp(): string {
    return `
  <div class="sub-lib-card">
    <h2>${this.data.title}</h2>
    ${this.checkBooks()}
    ${
      this.data.books.length > 5
        ? `<a class="link" href="/sub-library?q=${this.data.location}" data-link><p>View more books</p></a>`
        : ""
    }
  </div>
    `;
  }
}

customElements.define("sub-lib-card", SubLibCard);
