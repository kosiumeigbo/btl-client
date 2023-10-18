class TestComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.innerHTML = this.render();
  }

  render(): string {
    return `
    <h1>Hello</h1>
    `;
  }
}

customElements.define("my-test-component", TestComponent);

export default TestComponent;
