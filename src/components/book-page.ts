import type { BookObj } from "../types";

export default class BookPage extends HTMLElement {
  data!: BookObj;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  }

  render(): string {
    return ``;
  }
}

customElements.define("book-page", BookPage);
