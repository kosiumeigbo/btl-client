import { state, resetStateSearch, updateStateSearchResult } from "../model";
import type { BookObj } from "../types";
import type BookObjCard from "./book-obj-card";
import "./book-obj-card";

export class SearchPage extends HTMLElement {
  _data!: {
    query: string;
    result: BookObj | "No result" | null;
  };

  constructor() {
    super();
  }

  get data(): {
    query: string;
    result: BookObj | "No result" | null;
  } {
    return this._data;
  }

  set data(data) {
    if (this._data !== data) {
      this._data = data;
    }
  }

  connectedCallback(): void {
    this.data = state.search;
  }
}

customElements.define("search-page", SearchPage);
