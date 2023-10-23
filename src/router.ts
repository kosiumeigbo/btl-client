// import HomePage from "./components/HomePage.ts";
import { getNyTimesBestSellers, getResultFromSearch } from "./model.ts";

getNyTimesBestSellers().catch((e: Error) => {
  console.log(e);
});

getResultFromSearch("9781649374042678").catch((e: Error) => {
  console.log(e);
});
