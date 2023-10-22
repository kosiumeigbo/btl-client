// import HomePage from "./components/HomePage.ts";
import { getNyTimesBestSellers } from "./model.ts";

const showNyTimesData = async function (): Promise<void> {
  try {
    const newData = await getNyTimesBestSellers();
    if (!(newData instanceof Error)) console.log("NYTimes:", newData);
  } catch (e) {
    console.log(e);
  }
};
showNyTimesData();

fetch("https://openlibrary.org/api/books?bibkeys=ISBN:9781649374042&format=json&jscmd=data")
  .then((res) => res.json())
  .then((data) => {
    console.log("OpenLibrary:", data);
  })
  .catch((err) => {
    console.log(err);
  });
