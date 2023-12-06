import type { BookObj } from "../types";

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
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
        <a href="/book?isbn=${this._data.isbn}">
          <div><img src="${this._data.imageSource}" alt="${this._data.title} by ${this._data.author} cover photo" /></div>
          <p>${this._data.title}</p>
          <p><span>${this._data.author}</span></p>
        </a>
        `;
  }
}

customElements.define("sub-lib-book-card", SubLibBookCard);
