function t(t){return t&&t.__esModule?t.default:t}var a=globalThis,e={},s={},o=a.parcelRequirebde6;null==o&&((o=function(t){if(t in e)return e[t].exports;if(t in s){var a=s[t];delete s[t];var o={id:t,exports:{}};return e[t]=o,a.call(o.exports,o,o.exports),o.exports}var r=Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(t,a){s[t]=a},a.parcelRequirebde6=o),(0,o.register)("27Lyk",function(t,a){Object.defineProperty(t.exports,"register",{get:()=>e,set:t=>e=t,enumerable:!0,configurable:!0});var e,s=new Map;e=function(t,a){for(var e=0;e<a.length-1;e+=2)s.set(a[e],{baseUrl:t,path:a[e+1]})}}),o("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["1LzKV","index.6e054847.js","7Lx5k","generic-book.b8da78ac.png"]'));const r=document.getElementById("books-to-read-total"),i=document.getElementById("books-in-progress-total"),n=document.getElementById("books-done-total"),l=document.getElementById("library-total");null!==r&&null!==i&&null!==n&&null!==l&&document.addEventListener("lib-btn-pressed",t=>{let a=t.detail;console.log(a),r.textContent=a.totalBooksToRead().toString(),i.textContent=a.totalBooksInProgress().toString(),n.textContent=a.totalBooksDone().toString(),l.textContent=(a.totalBooksToRead()+a.totalBooksInProgress()+a.totalBooksDone()).toString()});const d=document.querySelector(".hamburger i"),c=document.querySelector("nav"),u=document.querySelector(".close-btn");null!==d&&d.addEventListener("click",function(t){null!==c&&c.classList.add("hamburger-clicked")}),null!==u&&u.addEventListener("click",function(t){null!==c&&c.classList.remove("hamburger-clicked")});class b extends HTMLElement{_data;constructor(){super(),this.classList.add("nyt-book-card")}get data(){return this._data}set data(t){this._data!==t&&(this._data=t,this.render())}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return`
      <a href="/book?isbn=${this._data.isbn}">
        <div><img src="${this._data.imageSource}" alt="${this._data.title} by ${this._data.author} cover photo" /></div>
        <p>${this._data.title}</p>
        <p><span>${this._data.author}</span></p>
      </a>
      `}}customElements.define("nyt-book-card",b);class h extends HTMLElement{_data;constructor(){super(),this.classList.add("nyt-category-card")}get data(){return this._data}set data(t){if(this._data!==t){this._data=t,this.render();let a=this.querySelectorAll("nyt-book-card");a.forEach((t,a)=>{t.data=this.data.books[a]})}}connectedCallback(){}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return`
        <h2>${this._data.listName}</h2>
        <div>
        ${this._data.books.map(t=>"<nyt-book-card></nyt-book-card>").join("")}
        </div>
      `}}customElements.define("nyt-category-card",h);// OpenLibrary URL example: "https://openlibrary.org/api/books?bibkeys=ISBN:9781649374042&format=json&jscmd=data"
const k={nyTimesBestSeller:[],search:{query:"",result:null},libraryBooks:[],nonLibraryBooks:[]},f=function(){k.search.query="",k.search.result=null},p=function(t,a){let e=k.libraryBooks.findIndex(t=>t.isbn===a),s=k.libraryBooks.find(t=>t.isbn===a);if(-1!==e&&void 0!==s){if(s.location===t){let[t]=k.libraryBooks.splice(e,1);return t.location="not-in-library",k.nonLibraryBooks.push(t),t}return s.location=t,k.libraryBooks.splice(e,1,s),s}let o=k.nonLibraryBooks.findIndex(t=>t.isbn===a),r=k.nonLibraryBooks.find(t=>t.isbn===a);if(-1!==o&&void 0!==r){let[a]=k.nonLibraryBooks.splice(o,1);return a.location=t,k.libraryBooks.push(a),a}return Error()},g=async function(){try{let t=await fetch("https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=LdtHYiyVFZ8XYsUSqTxpeal9VFqsvDbs");if(!t.ok||200!==t.status)throw Error();let a=(await t.json()).results.lists;k.nyTimesBestSeller=a.map(t=>{let a=t.list_name,e=t.books.map(t=>({author:t.author,imageSource:t.book_image,isbn:t.primary_isbn13,title:t.title}));return{listName:a,books:e}})}catch(t){t.message="Could not get data from server",k.nyTimesBestSeller=[]}},y=async function(){await g(),setInterval(g,24e4)};y();// Function that accepts isbn as string, goes through Open Library to get the book
// and updates state's search object, else returns an Error.
// Will run when SearchPage is first loaded and also when the user presses the search button
const m=async function(t){try{k.search.query=t;let a=await _(t);if(a instanceof Error)throw a;if("string"==typeof a){k.search.result=a;return}let e=k.libraryBooks.find(t=>t.isbn===a.isbn),s=k.nonLibraryBooks.find(t=>t.isbn===a.isbn);void 0!==e?k.search.result=e:void 0!==s?k.search.result=s:(k.search.result=a,k.nonLibraryBooks.push(a))}catch(t){return t}},_=async function(t){try{let a=await B(t);if(a instanceof Error||"string"==typeof a){let a=await v(t);if(a instanceof Error)throw a;return a}return a}catch(t){return t}},v=async function(t){try{let a=await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${t}&format=json&jscmd=data`);if(!a.ok||200!==a.status)throw Error();let e=await a.json();if(0===Object.keys(e).length)return"No result";let s=e[`ISBN:${t}`],o=s.authors?.map(t=>t.name).join(", ")??null,r=s.cover?.large??null,i=s.identifiers.isbn_13??s.identifiers.isbn_10,n=i[0],l=s.number_of_pages??s.pagination??null,d="number"==typeof l?l.toString():l,c=s.publish_date??null,u=s.publishers?.map(t=>t.name).join(", ")??null,b=s.title??null,h=s.url??null;return{author:o,imageSource:r,isbn:n,numberOfPages:d,datePublished:c,publisher:u,title:b,link:h,location:"not-in-library"}}catch(t){return t.message="Could not get data from server",t}},B=async function(t){try{let a=await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${t}&key=AIzaSyAgq8935QbNIHZ27D5kf-LIWkUazKv8pV8`);if(!a.ok||200!==a.status)throw Error();let e=await a.json();if(0===e.totalItems)return"No result";let[s]=e.items,{volumeInfo:o}=s,r=o.authors?.join(", ")??null,i=o.imageLinks?.thumbnail??o.imageLinks?.smallThumbnail??null,n=o.industryIdentifiers?.find(t=>"ISBN_13"===t.type)?.identifier??o.industryIdentifiers?.find(t=>"ISBN_10"===t.type)?.identifier??"N/A",l=0===o.pageCount?null:o.pageCount?.toString()??null,d=o.publishedDate??null,c=o.publisher??null,u=o.title??null,b=s.volumeInfo.previewLink??null;return{author:r,imageSource:i,isbn:n,numberOfPages:l,datePublished:d,publisher:c,title:u,link:b,location:"not-in-library"}}catch(t){return t.message="Could not get data from server",t}};class T extends HTMLElement{_data;constructor(){super(),this.classList.add("home-page")}get data(){return this._data}set data(t){this._data!==t&&(this._data=t)}connectedCallback(){this.updateThisData()}async updateThisData(){0===k.nyTimesBestSeller.length&&await g(),this.data=k.nyTimesBestSeller,this.render();let t=this.querySelectorAll("nyt-category-card");0!==t.length&&t.forEach((t,a)=>{t.data=this._data[a]})}render(){this.innerHTML=this.getMarkUp()}getMarkUp(){return 0===this._data.length?'<h2 style="margin-top: 10rem; display: flex; justify-content: center">Oops. You have reached the limit for calling the NYTimes API Endpoint.</h2>':`
      <h1>NY Times Best Sellers for this week</h1>
      ${this._data.map(t=>"<nyt-category-card></nyt-category-card>").join("")}
    `}}customElements.define("home-page",T);var L={};L=new URL("generic-book.b8da78ac.png",import.meta.url).toString();class $ extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data=t,this.render()}connectedCallback(){this.addEventListener("click",t=>{this.btnPressed(t)})}btnPressed(t){let a=t.target.closest("[data-library][data-isbn]");if(console.log(a),null!==a){let t=a.dataset.isbn,e=a.dataset.library;if(console.log(t,e),"string"==typeof t&&"string"==typeof e){let a=p(e,t);console.log(a),a instanceof Error||(this.data=a)}let s=new CustomEvent("lib-btn-pressed",{bubbles:!0,detail:{totalBooksDone:()=>k.libraryBooks.filter(t=>"booksDone"===t.location).length,totalBooksInProgress:()=>k.libraryBooks.filter(t=>"booksInProgress"===t.location).length,totalBooksToRead:()=>k.libraryBooks.filter(t=>"booksToRead"===t.location).length}});this.dispatchEvent(s)}}render(){this.innerHTML=this.getMarkUp()}getLibraryButtonsMarkUp(){return"booksInProgress"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to 'Books In Progress'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
        `:"booksToRead"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to 'Books To Read'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to 'Books Done'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
      `:"booksDone"===this._data.location?`
        <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to 'Books In Progress'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
          ><span>In Progress</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to 'Books To Read'">
          <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
        </button>
        <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to 'Books Done'">
          <i class="fa-regular fa-circle-check" style="color: #2aff1c"></i> <i class="fa-solid fa-check"></i><span>Done</span>
        </button>
        `:`
      <button data-isbn="${this._data.isbn}" data-library="booksInProgress" title="Add to 'Books In Progress'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-book-open"></i
        ><span>In Progress</span>
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksToRead" title="Add to 'Books To Read'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-list"></i><span>To Read</span>
      </button>
      <button data-isbn="${this._data.isbn}" data-library="booksDone" title="Add to 'Books Done'">
        <i class="fa-solid fa-circle-plus"></i> <i class="fa-solid fa-check"></i><span>Done</span>
      </button>
        `}getMarkUp(){return`
  <div class="book-obj-card" style="margin-bottom: 100px">
    <div class="book-obj-card__img">
      <a href="/book?isbn=${this._data.isbn}">
        <img src="${this._data.imageSource??/*@__PURE__*/t(L)}" alt="${this._data.title??"N/A"} by ${this._data.author??"N/A"}" />
      </a>
    </div>
    <div class="book-obj-card__info">
      <h2>${this._data.title??"N/A"}</h2>
      <p>${this._data.author??"N/A"}</p>
      <div>
        ${this.getLibraryButtonsMarkUp()}
      </div>
    </div>
    <a href="/book?isbn=${this._data.isbn}">
      Go to book page &nbsp; <i class="fa-solid fa-arrow-right-from-bracket"></i>
    </a>
  </div>
    `}}customElements.define("book-obj-card",$);class S extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data!==t&&(this._data=t)}connectedCallback(){this.data=k.search,this.render();let t=this.querySelector("book-obj-card");null!==t&&null!==this._data.result&&"No result"!==this._data.result&&(t.data=this._data.result),this.addEventListener("click",t=>{this.updateThisData(t)})}disconnectedCallback(){f()}async updateThisData(t){let a=t.target.closest("#book-search-btn"),e=this.querySelector("input")?.value?.trim(),s=this.querySelector(".search-results");if(null!==a&&void 0!==e&&null!==s){if(0===e.length){s.innerHTML="<h2>Please enter a value</h2>";return}if(isNaN(Number(e))){s.innerHTML="<h2>Please enter a valid ISBN with only the numbers</h2>";return}try{let t=await m(e);if(t instanceof Error)throw t;this.data=k.search,this.render();let a=this.querySelector("book-obj-card");null!==a&&null!==this._data.result&&"No result"!==this._data.result&&(a.data=this._data.result)}catch(t){s.innerHTML=`<h2>${t.message}</h2>`}}}renderSearchResultsArea(){return null===this._data.result?"<h2>Please enter an ISBN to search for a book \uD83D\uDE42.</h2>":"No result"===this._data.result?`<h2>Oops! No result found for ${this._data.query}</h2>`:`
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
    `}}customElements.define("search-page",S);class E extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){this._data!==t&&(this._data=t,this.render())}render(){this.outerHTML=this.getMarkUp()}getMarkUp(){return`
  <div class="sub-lib-book-card">
    <a href="/book?isbn=${this.data.isbn}">
      <div><img src="${this.data.imageSource??/*@__PURE__*/t(L)}" alt="${this.data.title??"N/A"} by ${this.data.author??"N/A"}" /></div>
      <h3>${this.data.title??"N/A"}</h3>
      <p><span>${this.data.author??"N/A"}</span></p>
    </a>
  </div>
  `}}customElements.define("sub-lib-book-card",E);class I extends HTMLElement{_data;constructor(){super()}get data(){return this._data}set data(t){if(this._data!==t){this._data=t,this.render();let a=document.querySelectorAll("sub-lib-book-card");(0!==a.length||null!==a)&&a.forEach((t,a)=>{t.data=this.data.books[a]})}}render(){this.outerHTML=this.getMarkUp()}checkBooks(){if(0===this.data.books.length)return`
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
    ${this.data.books.length>5?`<a href="/sub-library?q=${this.data.location}"><p>View more</p></a>`:""}
  </div>
    `}}customElements.define("sub-lib-card",I);class M extends HTMLElement{constructor(){super()}connectedCallback(){this.render();let t=document.querySelectorAll("sub-lib-card");(0!==t.length||null!==t)&&(t[0].data={title:"Books In Progress",location:"booksInProgress",books:k.libraryBooks.filter(t=>"booksInProgress"===t.location)},t[1].data={title:"Books To Read",location:"booksToRead",books:k.libraryBooks.filter(t=>"booksToRead"===t.location)},t[2].data={title:"Books Done",location:"booksDone",books:k.libraryBooks.filter(t=>"booksDone"===t.location)})}render(){this.outerHTML=this.getMarkUp()}getMarkUp(){return`
  <div class="library-page">
    <h1>Library</h1>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
    <sub-lib-card></sub-lib-card>
  </div>
    `}}customElements.define("library-page",M);//# sourceMappingURL=index.6e054847.js.map

//# sourceMappingURL=index.6e054847.js.map
