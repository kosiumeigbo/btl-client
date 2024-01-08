import type { BookObj } from "../types";
import bookImage from "url:../assets/images/generic-book.png";

export default class SubLibBookCard extends HTMLElement {
  _data!: BookObj;

  constructor() {
    super();
  }

  get data(): BookObj {
    return this._data;
  }

  set data(data: BookObj) {
    if (this._data !== data) {
      this._data = data;
      this.render();
    }
  }

  render(): void {
    this.outerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
  <div class="sub-lib-book-card">
    <a href="/book?isbn=${this.data.isbn}" data-link>
      <div><img src="${this.data.imageSource ?? bookImage}" alt="${this.data.title ?? "N/A"} by ${
        this.data.author ?? "N/A"
      }" /></div>
      <h3>${this.data.title ?? "N/A"}</h3>
      <p><span>${this.data.author ?? "N/A"}</span></p>
    </a>
  </div>
  `;
  }
}

customElements.define("sub-lib-book-card", SubLibBookCard);
