import OuterTestComponent from "./components/OuterTestComponent.ts";
import "./components/TestComponent.ts";

const root = document.querySelector("#root");

root?.insertAdjacentElement("afterbegin", new OuterTestComponent());
