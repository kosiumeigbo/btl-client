import OuterTestComponent from "./components/OuterTestComponent.ts";

const root = document.querySelector("#root");

root?.insertAdjacentElement("afterbegin", new OuterTestComponent());
