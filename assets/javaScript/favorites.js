"use strict";

/*function addEventListener() {
  document.querySelectorAll(".bookmark").forEach(b => {
  b.addEventListener("click", e => createProgrammeElements("favourites", parseFavoritesFromLS("object")));
  console.log("clicked");
})
};*/

createProgrammeElements("favourites", parseFavoritesFromLS("object"));
//addEventListener();

window.addEventListener("storage", e => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object"));
});
