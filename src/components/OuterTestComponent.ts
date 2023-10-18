class OuterTestComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.innerHTML = this.render();
  }

  render(): string {
    return `
      <h1>Hello</h1>
      <my-test-component/>
      `;
  }
}

customElements.define("my-outer-test-component", OuterTestComponent);

export default OuterTestComponent;
