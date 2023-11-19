const hamburgerButton = document.querySelector(".hamburger i");
const navSection = document.querySelector("nav");
const closeBtn = document.querySelector(".close-btn");

if (hamburgerButton !== null) {
  hamburgerButton.addEventListener("click", function (e) {

    if (navSection !== null) {
      navSection.classList.add("hamburger-clicked");
    }
  });
}

if (closeBtn !== null) {
  closeBtn.addEventListener("click", function (e) {

    if (navSection !== null) {
      navSection.classList.remove("hamburger-clicked");
    }
  });
}
