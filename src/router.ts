// import HomePage from "./components/HomePage.ts";
import "./components/home-page";
import { getBookObjFromOpenLibrary } from "./model";

getBookObjFromOpenLibrary("111").catch((e: Error) => {
  console.log(e);
});
