import "./hamburgerControl";
import "./components/search-page";
import { getBookObjFromOpenLibrary } from "./model";


getBookObjFromOpenLibrary("978-0349437019").catch((e: Error) => {
  console.log(e);
});
