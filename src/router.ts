import "./components/home-page";
import { getBookObjFromOpenLibrary } from "./model";
import "./hamburgerControl";

getBookObjFromOpenLibrary("978-0593669891").catch((e: Error) => {
  console.log(e);
});
