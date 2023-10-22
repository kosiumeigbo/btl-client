class TestComponent extends HTMLElement {
  data: string = "";

  constructor() {
    super();
  }

  static observedAttributes = ["data"];

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === "data") this.data = newValue;
  }

  connectedCallback(): void {
    this.render();
  }

  render(data): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
    <h1>This is the inner test component: ${this.data.length}</h1>
    `;
  }
}

customElements.define("my-test-component", TestComponent);

export default TestComponent;
