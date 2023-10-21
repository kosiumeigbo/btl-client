import "./TestComponent";

class OuterTestComponent extends HTMLElement {
  data: string;

  constructor(data: string) {
    super();
    this.data = data;
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    this.innerHTML = this.getMarkUp();
  }

  getMarkUp(): string {
    return `
    <h1 data="hello">This is from Outer Component: ${this.data}</h1>
      <my-test-component data="${this.data}"/>
      `;
  }
}

customElements.define("my-outer-test-component", OuterTestComponent);

export default OuterTestComponent;
