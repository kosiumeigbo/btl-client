import "./TestComponent";

class OuterTestComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.innerHTML = this.render();
  }

  render(): string {
    return `
      <my-test-component/>
      `;
  }
}

customElements.define("my-outer-test-component", OuterTestComponent);

export default OuterTestComponent;
