import type { nyTimesHomePageListObj } from "../types";
import type NytCategoryCard from "./nyt-category-card";
import "./nyt-category-card";
import { state, updateStateNyTimesBestSeller } from "../model";

export class HomePage extends HTMLElement {
  _data!: nyTimesHomePageListObj[];

  constructor() {
    super();
    this.classList.add("home-page");
  }

  get data(): nyTimesHomePageListObj[] {
    return this._data;
  }

  set data(data) {
    if (this._data !== data) {
      this._data = data;
    }
  }

  connectedCallback(): void {
    this.updateThisData();
  }

  async updateThisData(): Promise<void> {
    if (state.nyTimesBestSeller.length === 0) {
      await updateStateNyTimesBestSeller();
    }
    this.data = state.nyTimesBestSeller;
    this.render();

    const nytCatCards = this.querySelectorAll("nyt-category-card");

    if (nytCatCards.length !== 0) {
      nytCatCards.forEach((card, index) => {
        (card as NytCategoryCard).data = this._data[index];
      });
    }
  }

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    if (this._data.length === 0) {
      return `<h2 style="margin-top: 10rem; display: flex; justify-content: center">Oops. You have reached the limit for calling the NYTimes API Endpoint.</h2>`;
    }

    return `
      <h1>NY Times Best Sellers for this week</h1>
      ${this._data
        .map((obj) => {
          return `<nyt-category-card></nyt-category-card>`;
        })
        .join("")}
    `;
  }
}

customElements.define("home-page", HomePage);
