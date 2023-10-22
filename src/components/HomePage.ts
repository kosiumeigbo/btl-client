import type { nyTimesHomePageListObj } from "../types";

class HomePage extends HTMLElement {
  data!: nyTimesHomePageListObj[];

  constructor() {
    super();
  }

  connectedCallback(init: () => number): void {}

  render(data: nyTimesHomePageListObj[]): void {
    this.data = data;
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
      `;
  }
}

customElements.define("home-page", HomePage);

export default new HomePage();
