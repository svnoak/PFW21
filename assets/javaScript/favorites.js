"use strict";

window.addEventListener("storage", e => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object")),
  false;
});

createProgrammeElements("favourites", parseFavoritesFromLS("object"));
