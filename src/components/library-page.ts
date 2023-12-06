import type { BookObj } from "../types";

export default class LibraryPage extends HTMLElement {
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

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
          <h2>Yooooo</h2>
          `;
  }
}

customElements.define("library-page", LibraryPage);
