import "./components/home-page";
import { getBookObjFromOpenLibrary } from "./model";
import "./hamburgerControl";

getBookObjFromOpenLibrary("111").catch((e: Error) => {
  console.log(e);
});
