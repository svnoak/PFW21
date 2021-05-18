"use strict";

clearSearchBar();
document.getElementById("searchbar").addEventListener("keyup", getProgrammesBySearchWord);

function clearSearchBar() {
  document.getElementById("searchbar").value = "";
}

let programmes = [];
let cities = [];
let countries = [];
let levels = [];
let allFilterWords = [programmes, cities, levels];
function getProgrammesBySearchWord(event) {
  if (event.keyCode == 13 && this.value.length > 0) {
    let input = this.value.toLocaleLowerCase();
    searchWords.push(input);
    createPillForSearchWordsOnSearchSite(this.value);
    clearSearchBar();

    if (DB.PROGRAMMES.some((obj) => obj.name.toLocaleLowerCase().includes(input))) programmes.push(input);
    if (DB.PROGRAMMES.some((obj) => getCityFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))) {
      cities.push(input);
    }
    if (DB.PROGRAMMES.some((obj) => getCountryFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))) {
      let country = DB.COUNTRIES.find((obj) => obj.name.toLocaleLowerCase().includes(input));
      let citiesInCountry = DB.CITIES.filter((obj) => obj.countryID === country.id);
      citiesInCountry.forEach((obj) => {
        cities.push(obj.name.toLocaleLowerCase());
      });
    }
    if (DB.PROGRAMMES.some((obj) => getLevel(obj.level).toLocaleLowerCase().includes(input))) levels.push(input);

    filterProgramme(DB.PROGRAMMES);
  }
}

function filterProgramme(array) {
  let passArray = [];
  if (programmes.length > 0) {
    programmes.forEach((searchWord) => {
      array.forEach((obj) => {
        if (obj.name.toLocaleLowerCase().includes(searchWord)) {
          console.log("test");
          passArray.push(obj);
        }
      });
    });
    filterCity(passArray);
  } else {
    filterCity(array);
  }
}
function filterCity(array) {
  let passArray = [];
  if (cities.length > 0) {
    cities.forEach((searchWord) => {
      array.forEach((obj) => {
        if (getCityFromUniID(obj.universityID).name.toLocaleLowerCase().includes(searchWord)) {
          passArray.push(obj);
        }
      });
    });
    filterCountry(passArray);
  } else {
    filterCountry(array);
  }
}
function filterCountry(array) {
  let passArray = [];
  if (countries.length > 0) {
    countries.forEach((searchWord) => {
      array.forEach((obj) => {
        if (getCountryFromUniID(obj.universityID).name.toLocaleLowerCase().includes(searchWord)) {
          passArray.push(obj);
        }
      });
    });
    filterLevels(passArray);
  } else {
    filterLevels(array);
  }
}
function filterLevels(array) {
  let passArray = [];
  if (levels.length > 0) {
    levels.forEach((searchWord) => {
      array.forEach((obj) => {
        if (getLevel(obj.level).toLocaleLowerCase().includes(searchWord)) {
          passArray.push(obj);
        }
      });
    });
    sortSearchResult(passArray);
  } else {
    sortSearchResult(array);
  }
}

function createProgrammeElements(programmes) {
  document.getElementById("search-results").innerHTML = "";
  programmes.forEach((obj) => {
    let searchResultCard = document.createElement("div");
    searchResultCard.className = "search-result-card";

    let bookmark = document.createElement("div");
    bookmark.className = `bookmark`;
    bookmark.setAttribute("programmeID", obj.id);
    bookmark.innerHTML = bookmarkIcon;
    bookmark.addEventListener("click", saveBookmarked);

    let programmeImage = document.createElement("div");
    programmeImage.style.backgroundImage = `url(assets/images/${getCityImgFromUniID(obj.universityID)})`;
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

    searchResultCard.append(programmeImage, bookmark, programmeCardInfo);

    render("#search-results", searchResultCard);
  });
}
function saveBookmarked(event) {
  console.log(event.target.attributes[1].nodeValue);
  let target = event.target;
  target.classList.toggle("filled");
  addBookmarksToLS();
}
function addBookmarksToLS() {
  let bookmarks = document.querySelectorAll(".filled");
  let bookmarkIDs = [];
  bookmarks.forEach((obj) => {
    bookmarkIDs.push(parseInt(obj.attributes[1].nodeValue));
  });
  localStorage.setItem("favoriteProgrammes", JSON.stringify(bookmarkIDs));
  console.log(bookmarkIDs);
}
function sortSearchResult(programmes) {
  createProgrammeElements(programmes);
}

function createPillForSearchWordsOnSearchSite(searchWord, parentElement = "#search-words-pills") {
  let pill = document.createElement("div");
  pill.className = "pill";

  let pillSearchWord = document.createElement("p");
  pillSearchWord.className = "pill-search-word";
  pillSearchWord.textContent = searchWord;

  let removePillButton = document.createElement("button");
  removePillButton.className = "remove-pill";
  removePillButton.textContent = "X";
  removePillButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
    let removeWord = event.target.previousSibling.innerHTML.toLocaleLowerCase();
    for (let i = 0; i < allFilterWords.length; i++) {
      allFilterWords[i].forEach((obj) => {
        if (obj.includes(removeWord)) {
          console.log(i);
          let index = 0;
          switch (i) {
            case 0:
              index = programmes.findIndex((word) => word == removeWord);
              programmes.splice(index, 1);
              filterProgramme(DB.PROGRAMMES);
              break;
            case 1:
              index = cities.findIndex((word) => word == removeWord);
              cities.splice(index, 1);
              filterProgramme(DB.PROGRAMMES);
              break;
            case 2:
              index = levels.findIndex((word) => word == removeWord);
              levels.splice(index, 1);
              filterProgramme(DB.PROGRAMMES);
              break;

            default:
              break;
          }
        }
      });
    }
  });
  pill.append(pillSearchWord, removePillButton);
  render(parentElement, pill);
}
