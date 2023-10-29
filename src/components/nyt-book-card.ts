import type { BookObjNYT } from "../types";

export default class NytBookCard extends HTMLElement{
  _data!: BookObjNYT;

  constructor() {
    super();
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
      <h1>This is the author name: ${this._data.author}</h1>
      <h1>This book isbn is: ${this._data.isbn}</h1>
      <h1>This book title is: ${this._data.title}</h1>
      <img src="${this._data.imageSource}"/>
      `;
  }
}

customElements.define("nyt-book-card", NytBookCard);
