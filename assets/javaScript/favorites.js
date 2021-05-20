"use strict";

createProgrammeElements("favourites", parseFavoritesFromLS("object"));

window.addEventListener("storage", e => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object"));
});
