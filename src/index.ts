import "./hamburgerControl";
import "./components/search-page";
import { getBookObj } from "./model";

getBookObj("9780349437019").catch((e: Error) => {
  console.log(e);
});
