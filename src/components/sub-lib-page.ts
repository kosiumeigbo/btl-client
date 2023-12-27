import type { BookObj } from "../types";
import { /* state, */ getLocalStorage, setLocalStorage } from "../model";
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

    this.render();
  }

  disconnectedCallback(): void {
    setLocalStorage();
  }

  render(): void {
    this.innerHTML = this.getMarkup();
  }

  getMarkup(): string {
    if (this.data.length === 0) {
      return `
    <div class="book-page-no-result">
      <h1>No Result</h1>
      <p>Sorry, there is no result for this ISBN.</p>
    </div>        
        `;
    }
    return ``;
  }
}

customElements.define("sub-lib-page", SubLibPage);
