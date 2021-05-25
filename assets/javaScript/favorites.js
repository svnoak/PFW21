"use strict";

render(
  "#main",
  createCompareInfo(
    "Favoriter",
    "Här kan du se de program du sparat som favoriter. Om du vill jämföra några av programmen kan du gå vidare med knappen nedanför:",
    true
  )
);

createProgrammeElements("favourites", parseFavoritesFromLS("object"));

window.addEventListener("storage", (e) => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object"));
});

document.querySelector("#main").append(makeAd("k"));
