import OuterTestComponent from "./components/OuterTestComponent.ts";

const root = document.querySelector("#root");
const data: string = "TESTING!";

root?.insertAdjacentElement("afterbegin", new OuterTestComponent(data));
