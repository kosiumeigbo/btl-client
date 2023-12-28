function t(t){return t&&t.__esModule?t.default:t}var a=globalThis,o={},e={},s=a.parcelRequirebde6;null==s&&((s=function(t){if(t in o)return o[t].exports;if(t in e){var a=e[t];delete e[t];var s={id:t,exports:{}};return o[t]=s,a.call(s.exports,s,s.exports),s.exports}var i=Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,a){e[t]=a},a.parcelRequirebde6=s),(0,s.register)("27Lyk",function(t,a){Object.defineProperty(t.exports,"register",{get:()=>o,set:t=>o=t,enumerable:!0,configurable:!0});var o,e=new Map;o=function(t,a){for(var o=0;o<a.length-1;o+=2)e.set(a[o],{baseUrl:t,path:a[o+1]})}}),s("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["1LzKV","index.6c04c0be.js","7Lx5k","generic-book.b8da78ac.png"]'));// OpenLibrary URL example: "https://openlibrary.org/api/books?bibkeys=ISBN:9781649374042&format=json&jscmd=data"
const i={viewedBook:"No result",nyTimesBestSeller:[],search:{query:"",result:null},libraryBooks:[],nonLibraryBooks:[],locations:["booksDone","booksInProgress","booksToRead"]},r=function(){i.search.query="",i.search.result=null},n=function(){localStorage.setItem("libraryBooks",JSON.stringify(i.libraryBooks))},l=function(){localStorage.setItem("nonLibraryBooks",JSON.stringify(i.nonLibraryBooks))},d=function(){n(),l()},c=function(){let t=JSON.parse(localStorage.getItem("libraryBooks")??"[]");i.libraryBooks=t},b=function(){let t=JSON.parse(localStorage.getItem("nonLibraryBooks")??"[]");i.nonLibraryBooks=t},u=function(){c(),b()},h=function(t,a){let o=i.libraryBooks.findIndex(t=>t.isbn===a),e=i.libraryBooks.find(t=>t.isbn===a);if(-1!==o&&void 0!==e){if(e.location===t){let[t]=i.libraryBooks.splice(o,1);return t.location="not-in-library",i.nonLibraryBooks.push(t),d(),t}return e.location=t,i.libraryBooks.splice(o,1,e),d(),e}let s=i.nonLibraryBooks.findIndex(t=>t.isbn===a),r=i.nonLibraryBooks.find(t=>t.isbn===a);if(-1!==s&&void 0!==r){let[a]=i.nonLibraryBooks.splice(s,1);return a.location=t,i.libraryBooks.push(a),d(),a}return Error()},k=async function(){try{let t=await fetch("https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=LdtHYiyVFZ8XYsUSqTxpeal9VFqsvDbs");if(!t.ok||200!==t.status)throw Error();let a=(await t.json()).results.lists;i.nyTimesBestSeller=a.map(t=>{let a=t.list_name,o=t.books.map(t=>({author:t.author,imageSource:t.book_image,isbn:t.primary_isbn13,title:t.title}));return{listName:a,books:o}})}catch(t){t.message="Could not get data from server",i.nyTimesBestSeller=[]}},f=async function(){await k(),setInterval(k,24e4)};f();// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's search object, else returns an Error.
// Will run when SearchPage is first loaded and also when the user presses the search button
const p=async function(t){try{i.search.query=t;let a=await y(t);if(a instanceof Error)throw a;if("string"==typeof a){i.search.result=a;return}let o=i.libraryBooks.find(t=>t.isbn===a.isbn),e=i.nonLibraryBooks.find(t=>t.isbn===a.isbn);void 0!==o?i.search.result=o:void 0!==e?i.search.result=e:(i.search.result=a,i.nonLibraryBooks.push(a),d())}catch(t){return t}},g=async function(t){try{let a=await y(t);if(a instanceof Error)throw a;if("No result"===a){i.viewedBook=a;return}let o=i.libraryBooks.find(t=>t.isbn===a.isbn),e=i.nonLibraryBooks.find(t=>t.isbn===a.isbn);void 0!==o?i.viewedBook=o:void 0!==e?i.viewedBook=e:(i.viewedBook=a,i.nonLibraryBooks.push(a),d())}catch(t){return t}},y=async function(t){try{let a=await v(t);if(a instanceof Error||"string"==typeof a){let a=await m(t);if(a instanceof Error)throw a;return a}return a}catch(t){return t}},m=async function(t){try{let a=await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${t}&format=json&jscmd=data`);if(!a.ok||200!==a.status)throw Error();let o=await a.json();if(0===Object.keys(o).length)return"No result";let e=o[`ISBN:${t}`],s=e.authors?.map(t=>t.name).join(", ")??null,i=e.cover?.large??null,r=e.identifiers.isbn_13??e.identifiers.isbn_10,n=r[0],l=e.number_of_pages??e.pagination??null,d="number"==typeof l?l.toString():l,c=e.publish_date??null,b=e.publishers?.map(t=>t.name).join(", ")??null,u=e.title??null,h=e.url??null;return{author:s,imageSource:i,isbn:n,numberOfPages:d,datePublished:c,publisher:b,title:u,link:h,location:"not-in-library"}}catch(t){return t.message="Could not get data from server",t}},v=async function(t){try{let a=await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${t}&key=AIzaSyAgq8935QbNIHZ27D5kf-LIWkUazKv8pV8`);if(!a.ok||200!==a.status)throw Error();let o=await a.json();if(0===o.totalItems)return"No result";let[e]=o.items,{volumeInfo:s}=e,i=s.authors?.join(", ")??null,r=s.imageLinks?.thumbnail??s.imageLinks?.smallThumbnail??null,n=s.industryIdentifiers?.find(t=>"ISBN_13"===t.type)?.identifier??s.industryIdentifiers?.find(t=>"ISBN_10"===t.type)?.identifier??"N/A",l=0===s.pageCount?null:s.pageCount?.toString()??null,d=s.publishedDate??null,c=s.publisher??null,b=s.title??null,u=e.volumeInfo.previewLink??null;return{author:i,imageSource:r,isbn:n,numberOfPages:l,datePublished:d,publisher:c,title:b,link:u,location:"not-in-library"}}catch(t){return t.message="Could not get data from server",t}};document.addEventListener("DOMContentLoaded",()=>{let t=document.getElementById("books-to-read-total"),a=document.getElementById("books-in-progress-total"),o=document.getElementById("books-done-total"),e=document.getElementById("library-total");if(null!==t&&null!==a&&null!==o&&null!==e){document.addEventListener("lib-btn-pressed",s=>{let i=s.detail;console.log(i),t.textContent=i.totalBooksToRead().toString(),a.textContent=i.totalBooksInProgress().toString(),o.textContent=i.totalBooksDone().toString(),e.textContent=(i.totalBooksToRead()+i.totalBooksInProgress()+i.totalBooksDone()).toString()}),u();let s=i.libraryBooks.filter(t=>"booksToRead"===t.location).length,r=i.libraryBooks.filter(t=>"booksInProgress"===t.location).length,n=i.libraryBooks.filter(t=>"booksDone"===t.location).length;t.textContent=s.toString(),a.textContent=r.toString(),o.textContent=n.toString(),e.textContent=(s+r+n).toString()}});const _=document.querySelector(".hamburger i"),B=document.querySelector("nav"),L=document.querySelector(".close-btn");null!==_&&_.addEventListener("click",function(t){null!==B&&B.classList.add("hamburger-clicked")}),null!==L&&L.addEventListener("click",function(t){null!==B&&B.classList.remove("hamburger-clicked")});class S extends HTMLElement{_data;constructor(){super(),this.classList.add("nyt-book-card")}get data(){return this._data}set data(t){this._data!==t&&(this._data=t,this.render())}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return`
      <a href="/book?isbn=${this._data.isbn}">
        <div><img src="${this._data.imageSource}" alt="${this._data.title} by ${this._data.author} cover photo" /></div>
        <p>${this._data.title}</p>
        <p><span>${this._data.author}</span></p>
      </a>
      `}}customElements.define("nyt-book-card",S);class T extends HTMLElement{_data;constructor(){super(),this.classList.add("nyt-category-card")}get data(){return this._data}set data(t){if(this._data!==t){this._data=t,this.render();let a=this.querySelectorAll("nyt-book-card");a.forEach((t,a)=>{t.data=this.data.books[a]})}}connectedCallback(){}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return`
        <h2>${this._data.listName}</h2>
        <div>
        ${this._data.books.map(t=>"<nyt-book-card></nyt-book-card>").join("")}
        </div>
      `}}customElements.define("nyt-category-card",T);class I extends HTMLElement{_data;constructor(){super(),this.classList.add("home-page")}get data(){return this._data}set data(t){this._data!==t&&(this._data=t)}connectedCallback(){this.updateThisData()}async updateThisData(){0===i.nyTimesBestSeller.length&&await k(),this.data=i.nyTimesBestSeller,this.render();let t=this.querySelectorAll("nyt-category-card");0!==t.length&&t.forEach((t,a)=>{t.data=this._data[a]})}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return 0===this._data.length?'<h2 style="margin-top: 10rem; display: flex; justify-content: center">Oops. You have reached the limit for calling the NYTimes API Endpoint.</h2>':`
      <h1>NY Times Best Sellers for this week</h1>
      ${this._data.map(t=>"<nyt-category-card></nyt-category-card>").join("")}
    `}}customElements.define("home-page",I);var R={};R=new URL("generic-book.b8da78ac.png",import.meta.url).toString();class $ extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data=t,this.render()}connectedCallback(){this.addEventListener("click",t=>{this.btnPressed(t)})}btnPressed(t){let a=t.target.closest("[data-library][data-isbn]");if(console.log(a),null!==a){let t=a.dataset.isbn,o=a.dataset.library;if(console.log(t,o),"string"==typeof t&&"string"==typeof o){let a=h(o,t);console.log(a),a instanceof Error||(this.data=a)}let e=new CustomEvent("lib-btn-pressed",{bubbles:!0,detail:{totalBooksDone:()=>i.libraryBooks.filter(t=>"booksDone"===t.location).length,totalBooksInProgress:()=>i.libraryBooks.filter(t=>"booksInProgress"===t.location).length,totalBooksToRead:()=>i.libraryBooks.filter(t=>"booksToRead"===t.location).length}});this.dispatchEvent(e)}}render(){this.innerHTML=this.getMarkUp()}getLibraryButtonsMarkUp(){return"booksInProgress"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
        `:"booksToRead"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
      `:"booksDone"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
        `:`
      <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
        ><span>In Progress</span>
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
      </button>
        `}getMarkUp(){return`
  <div class="book-obj-card">
    <div class="book-obj-card__img">
      <a href="/book?isbn=${this._data.isbn}">
        <img src="${this._data.imageSource??/*@__PURE__*/t(R)}" alt="${this._data.title??"N/A"} by ${this._data.author??"N/A"}" />
      </a>
    </div>
    <div class="book-obj-card__info">
      <h2>${this._data.title??"N/A"}</h2>
      <p>${this._data.author??"N/A"}</p>
      <div>
        ${this.getLibraryButtonsMarkUp()}
      </div>
    </div>
    <a class="link" href="/book?isbn=${this._data.isbn}">
      Go to book page &nbsp; <i class="fa-solid fa-arrow-right-from-bracket"></i>
    </a>
  </div>
    `}}customElements.define("book-obj-card",$);class N extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data!==t&&(this._data=t)}connectedCallback(){u(),this.data=i.search,this.render();let t=this.querySelector("book-obj-card");null!==t&&null!==this._data.result&&"No result"!==this._data.result&&(t.data=this._data.result),this.addEventListener("click",t=>{this.updateThisData(t)})}disconnectedCallback(){d(),r()}async updateThisData(t){let a=t.target.closest("#book-search-btn"),o=this.querySelector("input")?.value?.trim(),e=this.querySelector(".search-results");if(null!==a&&void 0!==o&&null!==e){if(0===o.length){e.innerHTML="<h2>Please enter a value</h2>";return}if(isNaN(Number(o))){e.innerHTML="<h2>Please enter a valid ISBN with only the numbers</h2>";return}try{let t=await p(o);if(t instanceof Error)throw t;this.data=i.search,this.render();let a=this.querySelector("book-obj-card");null!==a&&null!==this._data.result&&"No result"!==this._data.result&&(a.data=this._data.result)}catch(t){e.innerHTML=`<h2>${t.message}</h2>`}}}renderSearchResultsArea(){return null===this._data.result?"<h2>Please enter an ISBN to search for a book \uD83D\uDE42.</h2>":"No result"===this._data.result?`<h2>Oops! No result found for ${this._data.query}</h2>`:`
      <book-obj-card></book-obj-card>
    `}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return`
  <div class="search-page">
    <div class="search-area">
      <div id="search-form">
        <label><h2>Search by book ISBN:</h2></label>
        <h2>Please enter only the numbers</h2>
        <div>
          <input type="text" id="book-search" autocomplete="off" value="${this._data.query}" />
          <button id="book-search-btn"><p>FIND BOOK</p></button>
        </div>
      </div>
    </div>

    <hr />

    <div class="search-results">
      ${this.renderSearchResultsArea()}
    </div>
  </div>    
    `}}customElements.define("search-page",N);class E extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data!==t&&(this._data=t,this.render())}render(){this.outerHTML=this.getMarkUp()}getMarkUp(){return`
  <div class="sub-lib-book-card">
    <a href="/book?isbn=${this.data.isbn}">
      <div><img src="${this.data.imageSource??/*@__PURE__*/t(R)}" alt="${this.data.title??"N/A"} by ${this.data.author??"N/A"}" /></div>
      <h3>${this.data.title??"N/A"}</h3>
      <p><span>${this.data.author??"N/A"}</span></p>
    </a>
  </div>
  `}}customElements.define("sub-lib-book-card",E);class P extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){if(this._data!==t){this._data=t,this.render();let a=document.querySelectorAll("sub-lib-book-card");(0!==a.length||null!==a)&&a.forEach((t,a)=>{t.data=this.data.books[a]})}}render(){this.outerHTML=this.getMarkUp()}checkBooks(){if(0===this.data.books.length)return`
      <div class="sub-lib-card__empty">
        <p>You have not added any book here. Add books to see them here! \u{1F642}</p>
      </div>
      `;if(this.data.books.length>=5){let t="";for(let a=0;a<5;a++)t+="<sub-lib-book-card></sub-lib-book-card>";return`
      <div class="sub-lib-card__books">
        ${t}
      </div>
      `}{let t="";for(let a=0;a<this.data.books.length;a++)t+="<sub-lib-book-card></sub-lib-book-card>";return`
      <div class="sub-lib-card__books">
        ${t}
      </div>
      `}}getMarkUp(){return`
  <div class="sub-lib-card">
    <h2>${this.data.title}</h2>
    ${this.checkBooks()}
    ${this.data.books.length>5?`<a class="link" href="/sub-library?q=${this.data.location}"><p>View more books</p></a>`:""}
  </div>
    `}}customElements.define("sub-lib-card",P);class M extends HTMLElement{constructor(){super()}connectedCallback(){u(),this.render();let t=document.querySelectorAll("sub-lib-card");(0!==t.length||null!==t)&&(t[0].data={title:"Books In Progress",location:"booksInProgress",books:i.libraryBooks.filter(t=>"booksInProgress"===t.location)},t[1].data={title:"Books To Read",location:"booksToRead",books:i.libraryBooks.filter(t=>"booksToRead"===t.location)},t[2].data={title:"Books Done",location:"booksDone",books:i.libraryBooks.filter(t=>"booksDone"===t.location)})}disconnectedCallback(){d()}render(){this.outerHTML=this.getMarkUp()}getMarkUp(){return`
  <div class="library-page">
    <h1>Library</h1>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
  </div>
    `}}customElements.define("library-page",M);class A extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data=t}connectedCallback(){u(),this.getBookObjFromISBN(),this.addEventListener("click",t=>{this.btnPressed(t)})}disconnectedCallback(){d()}async getBookObjFromISBN(){this.innerHTML='<div class="book-page"><h1>Loading...</h1></div>';let t=new URLSearchParams(window.location.search),a=t.get("isbn");if(null===a){this.renderForNullISBN();return}try{let t=await g(a);if(t instanceof Error)throw t;this.data=i.viewedBook,this.render()}catch(t){this.renderForErrorInISBNSearch(t)}}renderForNullISBN=()=>{this.innerHTML=`
      <div class="book-page-error">
        <h1>Invalid Page URL</h1>
        <p>Sorry, this is an invalid page URL.</p>
      </div>
    `};renderForErrorInISBNSearch=t=>{this.innerHTML=`
      <div class="book-page-error">
        <h1>Server Error</h1>
        <p>${t.message}</p>
      </div>
    `};render(){this.innerHTML=this.getMarkUp()}btnPressed(t){let a=t.target.closest("[data-library][data-isbn]");if(console.log(a),null!==a){let t=a.dataset.isbn,o=a.dataset.library;if(console.log(t,o),"string"==typeof t&&"string"==typeof o){let a=h(o,t);console.log(a),a instanceof Error||(this.data=a,this.render())}let e=new CustomEvent("lib-btn-pressed",{bubbles:!0,detail:{totalBooksDone:()=>i.libraryBooks.filter(t=>"booksDone"===t.location).length,totalBooksInProgress:()=>i.libraryBooks.filter(t=>"booksInProgress"===t.location).length,totalBooksToRead:()=>i.libraryBooks.filter(t=>"booksToRead"===t.location).length}});this.dispatchEvent(e)}}getLibraryButtonsMarkUp(t){return"booksInProgress"===t.location?`
        <button data-isbn="${t.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
        </button>
        `:"booksToRead"===t.location?`
        <button data-isbn="${t.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
        </button>
      `:"booksDone"===t.location?`
        <button data-isbn="${t.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
        </button>
        <button data-isbn="${t.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-check"></i>
        </button>
        `:`
      <button data-isbn="${t.isbn}" data-library="booksInProgress" title="Add to or Remove from 'Books In Progress'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i>
      </button>
      <button data-isbn="${t.isbn}" data-library="booksToRead" title="Add to or Remove from 'Books To Read'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i>
      </button>
      <button data-isbn="${t.isbn}" data-library="booksDone" title="Add to or Remove from 'Books Done'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i>
      </button>
        `}getMarkUp(){return"No result"===this.data?`
      <div class="book-page-no-result">
        <h1>No Result</h1>
        <p>Sorry, there is no result for this ISBN.</p>
      </div>
    `:`
    <div class="book-page">
      <div class="book-page__title">
        <h1>${this.data.title??"N/A"}</h1>
        <p>by <span style="text-decoration: underline; font-style: italic">${this.data.author??"N/A"}</span></p>
      </div>
      <div class="book-page__panel">
        <div class="image"><img src="${this.data.imageSource??/*@__PURE__*/t(R)}" alt="${this.data.title??"N/A"} by ${this.data.author??"N/A"}" /></div>
        <div class="add-to-lib-buttons">
          ${this.getLibraryButtonsMarkUp(this.data)}
        </div>
        ${null!==this.data.link?`<a class="link" target="_blank" href="${this.data.link}">Go to main site <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`:""}
      </div>
      <div class="book-page__info">
        <div class="book-page__info__title">
          <h1>${this.data.title??"N/A"}</h1>
          <p>by <span style="text-decoration: underline; font-style: italic">${this.data.author??"N/A"}</span></p>
        </div>
        <div>
          <h3>ISBN</h3>
          <p>${this.data.isbn}</p>
        </div>
        <div class="book-page__info__grid">
          <div>
            <h3>No. of pages</h3>
            <p>${this.data.numberOfPages??"N/A"}</p>
          </div>
          <div>
            <h3>Date published</h3>
            <p>${this.data.datePublished??"N/A"}</p>
          </div>
          <div>
            <h3>Publisher</h3>
            <p>${this.data.publisher??"N/A"}</p>
          </div>
        </div>
      </div>
    </div>
      `}}customElements.define("book-page",A);class w extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data=t}connectedCallback(){u(),this.getSubLibraryFromURLSearchParams()}disconnectedCallback(){d()}getSubLibraryFromURLSearchParams(){this.innerHTML='<div class="book-page"><h1>Loading...</h1></div>';let t=new URLSearchParams(window.location.search),a=t.get("q");if(null===a){this.renderForNullSubLibrary();return}let o=i.locations.some(t=>t===a);if(!o){this.renderForInvalidSubLibrary();return}this.data=i.libraryBooks.filter(t=>t.location===a),this.render(a);let e=document.querySelectorAll("book-obj-card");if(0!==e.length)for(let t=0;t<e.length;t++)e[t].data=this.data[t]}renderForNullSubLibrary=()=>{this.innerHTML=`
      <div class="sub-lib-page-error">
        <h1>Invalid Page URL</h1>
        <p>Sorry, this is an invalid page URL.</p>
      </div>
    `};renderForInvalidSubLibrary=()=>{this.innerHTML=`
      <div class="sub-lib-page-error">
        <h1>Invalid Sub-Library Location</h1>
        <p>Sorry, this is an invalid sub-library.</p>
      </div>
    `};render(t){this.innerHTML=this.getMarkup(t)}getMarkup(t){return 0===this.data.length?`
    <div class="sub-lib-page-empty">
      <h1>No Books Here</h1>
      <p>There are currently no books here. Come back when it isn't empty \u{1F600}</p>
    </div>
        `:`
    <div class="sub-lib-page">
      <h1>${"booksInProgress"===t?"In Progress":"booksToRead"===t?"To Read":"Done"}</h1>
      ${this.data.map(t=>"<book-obj-card></book-obj-card>").join("")}
    </div>
    `}}customElements.define("sub-lib-page",w);//# sourceMappingURL=index.6c04c0be.js.map

//# sourceMappingURL=index.6c04c0be.js.map
