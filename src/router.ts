// import HomePage from "./components/HomePage.ts";
import { getNyTimesBestSellers, getBookObjFromOpenLibrary } from "./model.ts";

getNyTimesBestSellers().catch((e: Error) => {
  console.log(e);
});

getBookObjFromOpenLibrary("9781649374042678").catch((e: Error) => {
  console.log(e);
});
