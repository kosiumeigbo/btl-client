// import { state } from "../model";
import type { BookObj } from "../types";

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
}
