import "./TestComponent";
import type { State } from "../types";

class OuterTestComponent extends HTMLElement {
  data: State;

  constructor(data: State) {
    super();
    this.data = data;
  }

  connectedCallback(): void {
    this.render();
    const header = this.querySelector("h1");
    let i = 1;

    header?.addEventListener("click", () => {
      console.log(i);
      i++;
    });
  }

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
    <h1 style="color: red">This is from Outer Component: ${this.data}</h1>
      <my-test-component data="${this.data}"/>
      `;
  }
}

customElements.define("my-outer-test-component", OuterTestComponent);

export default OuterTestComponent;
