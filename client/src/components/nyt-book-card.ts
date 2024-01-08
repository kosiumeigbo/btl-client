import type { BookObjNYT } from "../types";

export default class NytBookCard extends HTMLElement {
  _data!: BookObjNYT;

  constructor() {
    super();
    this.classList.add("nyt-book-card");
  }

  get data(): BookObjNYT {
    return this._data;
  }

  set data(data: BookObjNYT) {
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
      <a href="/book?isbn=${this._data.isbn}" data-link>
        <div><img src="${this._data.imageSource}" alt="${this._data.title} by ${this._data.author} cover photo" /></div>
        <p>${this._data.title}</p>
        <p><span>${this._data.author}</span></p>
      </a>
      `;
  }
}

customElements.define("nyt-book-card", NytBookCard);
