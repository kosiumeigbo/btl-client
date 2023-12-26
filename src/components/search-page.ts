import { state, resetStateSearch, updateStateSearchResult, getLocalStorage, setLocalStorage } from "../model";
import type { BookObj } from "../types";
import type BookObjCard from "./book-obj-card";
import "./book-obj-card";

export default class SearchPage extends HTMLElement {
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
    getLocalStorage();

    this.data = state.search;
    this.render();

    const bookObjCard = this.querySelector("book-obj-card");
    if (bookObjCard !== null && this._data.result !== null && this._data.result !== "No result") {
      (bookObjCard as BookObjCard).data = this._data.result;
    }

    this.addEventListener("click", (e) => {
      this.updateThisData(e);
    });
  }

  disconnectedCallback(): void {
    setLocalStorage();
    resetStateSearch();
  }

  async updateThisData(e: Event): Promise<void> {
    const searchBookButton = (e.target as HTMLElement).closest("#book-search-btn");
    const searchQuery = this.querySelector("input")?.value?.trim();
    const searchResultsArea = this.querySelector(".search-results");

    if (searchBookButton === null || searchQuery === undefined || searchResultsArea === null) return;

    if (searchQuery.length === 0) {
      searchResultsArea.innerHTML = `<h2>Please enter a value</h2>`;
      return;
    }

    if (isNaN(Number(searchQuery))) {
      searchResultsArea.innerHTML = `<h2>Please enter a valid ISBN with only the numbers</h2>`;
      return;
    }

    try {
      const update = await updateStateSearchResult(searchQuery);
      if (update instanceof Error) throw update;

      this.data = state.search;
      this.render();

      const bookObjCard = this.querySelector("book-obj-card");
      if (bookObjCard !== null && this._data.result !== null && this._data.result !== "No result") {
        (bookObjCard as BookObjCard).data = this._data.result;
      }
    } catch (e) {
      searchResultsArea.innerHTML = `<h2>${(e as Error).message}</h2>`;
    }
  }

  renderSearchResultsArea(): string {
    if (this._data.result === null) {
      return "<h2>Please enter an ISBN to search for a book 🙂.</h2>";
    }

    if (this._data.result === "No result") {
      return `<h2>Oops! No result found for ${this._data.query}</h2>`;
    }

    return `
      <book-obj-card></book-obj-card>
    `;
  }

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
  <div class="search-page">
    <div class="search-area">
      <div id="search-form">
        <label><h2>Search by book ISBN:</h2></label>
        <h2>Please enter only the numbers</h2>
        <div>
          <input type="text" id="book-search" autocomplete="off" value="${this._data.query}" />
          <button id="book-search-btn"><p>FIND BOOK</p></button>
        </div>
      </div>
    </div>

    <hr />

    <div class="search-results">
      ${this.renderSearchResultsArea()}
    </div>
  </div>    
    `;
  }
}

customElements.define("search-page", SearchPage);
