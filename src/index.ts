import "./hamburgerControl";
import "./components/search-page";
import { GOOGLE_BOOKS_API_KEY } from "./config";
import { getBookObjFromOpenLibrary } from "./model";

fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:9780008247690&key=${GOOGLE_BOOKS_API_KEY}`)
  .then((res) => res.json())
  .then((data) => {
    const [book] = data.items;
    console.log(book);
  });


getBookObjFromOpenLibrary("978-0349437019").catch((e: Error) => {
  console.log(e);
});
