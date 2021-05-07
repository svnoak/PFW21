"use strict";

document.getElementById("searchbar").addEventListener("keyup", getProgrammesBySearchWord);

function getProgrammesBySearchWord() {
  console.log(this.value);
  document.getElementById("search-results").innerHTML = "";
  if (this.value.length < 2) return;

  let programmes = DB.PROGRAMMES.filter((obj) => obj.name.includes(this.value));

  sortSearchResult(programmes);
  console.log(programmes);
}

function createProgrammeElements(programmes) {
  programmes.forEach((obj) => {
    let searchResultCard = document.createElement("div");
    searchResultCard.className = "search-result-card";

    let bookmark = document.createElement("div");
    bookmark.className = "bookmark";
    bookmark.innerHTML = bookmarkIcon;

    let programmeImage = document.createElement("div");
    programmeImage.style.backgroundImage = `url(../assets/images/${getCityImgFromUniID(obj.universityID)})`;
    programmeImage.className = "programme-image";

    let programmeCardInfo = document.createElement("div");
    programmeCardInfo.className = "programme-card-info";

    let programmeCardTitle = document.createElement("h3");
    programmeCardTitle.innerHTML = obj.name;

    let programmeCardSchool = document.createElement("div");
    programmeCardSchool.className = "programme-card-school";
    let cardSchool = document.createElement("p");
    cardSchool.className = "card-school";
    cardSchool.innerHTML = getUniversityFromUniID(obj.universityID).name;
    programmeCardSchool.innerHTML = homeIcon;
    programmeCardSchool.append(cardSchool);

    let programmeCardCity = document.createElement("div");
    programmeCardCity.className = "programme-card-city";
    let cardCity = document.createElement("p");
    cardCity.className = "card-city";
    cardCity.innerHTML = `${getCityFromUniID(obj.universityID).name}, ${getCountryFromUniID(obj.universityID).name}`;
    programmeCardCity.innerHTML = pinIcon;
    programmeCardCity.append(cardCity);

    let programmeCardLevelAndDate = document.createElement("div");
    let levelDiv = document.createElement("div");
    levelDiv.className = "flex-row";
    let cardLevel = document.createElement("p");
    cardLevel.className = "card-level";
    cardLevel.innerHTML = getLevel(obj.level);
    levelDiv.innerHTML = bookIcon;
    levelDiv.append(cardLevel);
    programmeCardLevelAndDate.append(levelDiv);

    let cardButtonDiv = document.createElement("div");
    let cardButton = document.createElement("button");
    cardButton.innerHTML = "Läs mer";
    cardButton.className = "card-button";
    cardButtonDiv.append(cardButton);
    cardButtonDiv.className = "card-button-div";

    programmeCardInfo.append(
      programmeCardTitle,
      programmeCardSchool,
      programmeCardCity,
      programmeCardLevelAndDate,
      cardButtonDiv
    );

    // Gå vidare till render
    searchResultCard.append(bookmark, programmeImage, programmeCardInfo);

    render(searchResultCard, "search-results");
  });
}

function sortSearchResult(programmes) {
  createProgrammeElements(programmes);
}

function render(element, parentElement) {
  var pelement = parentElement;
  document.getElementById(pelement).append(element);
  console.log(parentElement);
}
// *- getProgrammesBySearchWords(input.value) :: programmes[{}], hämtar alla program där söktermen och searchWords[]
//     matchar programnamn, land och stad. Kallar på sortSearchResult(programmes[{}])

// *- createProgrammeElements(programmes[{}]) :: DOM-elements, skapar element för de hämtade programmen (universitet, stad, nivå, termin, "läs mer"-knapp med eventlistener).
//  Rensar element i sökresultaten. Kallar på render(DOM-element, sökresultatslista) i en forEach-loop

// *- sortSearchResult(programmes[{}], sortKey = Bokstavsordning, sortOrder = stigande) :: programmes[{}],
//     sorterar programmes efter sortKey(Bokstavsordning/Antagningspoöng) i sortOrder(stigande/fallande). Kallar på createProgrammeElements(programmes[{}])

//* - render(elements, parentElement) :: appendar alla element (sökresultat/bokmärkeskort/land-kort) i parentElement
