"use strict";

var searchWords = [];

const RANDOM = {
  rInt: (max, min = 0) => Math.floor(min + (max - min) * Math.random()),
  rFloat: (max, min = 0) => min + (max - min) * Math.random(),
  coin: () => Math.random() > 0.5,
  array: function (a) {
    return a[this.rInt(a.length)];
  },
};

function getProgrammesById(id) {
  return DB.PROGRAMMES.find((obj) => obj.id == id);
}

function getProgrammesByName(programmeName) {
  return DB.PROGRAMMES.find((obj) => obj.name == programmeName);
}

function getUniversityFromUniID(universityID) {
  return DB.UNIVERSITIES.find((obj) => obj.id == universityID);
}
function getLevel(levelID) {
  return DB.LEVELS[levelID];
}
function getCityImgFromUniID(universityID) {
  let city = getCityFromUniID(universityID);
  let images = city.imagesNormal;
  return images[RANDOM.rInt(0, images.length - 1)];
}

function getCityFromUniID(universityID) {
  let cityID = DB.UNIVERSITIES.find((obj) => obj.id == universityID).cityID;
  return DB.CITIES.find((obj) => obj.id == cityID);
}

function getCountryFromUniID(universityID) {
  let countryID = getCityFromUniID(universityID).countryID;
  return DB.COUNTRIES.find((obj) => obj.id == countryID);
}
function getProgrammesField(subjectID) {
  return DB.FIELDS.find((obj) => obj.id == subjectID).name;
}

function render(parentElement, ...element) {
  document.querySelector(parentElement).append(...element);
}

function getLanguageFromUniID(universityID) {
  let languageID = getCountryFromUniID(universityID).languageID;
  return LANGUAGES.find( language => language.id == languageID ).name;
}

function resetUrlParameter() {
  let url = window.location.href.split("?")[0];
  window.history.replaceState( {} , "Title", `${url}` )
};

function setUrlParameter(string) {
  window.history.replaceState( {} , "Title", `${window.location.href}?${string}` )
}

function createPillForSearchWords(searchWord, parentElement = "#search-words-pills") {
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
    removePillFromArray(searchWord);
  });

  pill.append(pillSearchWord, removePillButton);
  searchWords.push(searchWord);
  render(parentElement, pill);
}

function getLanguageFromUniID(universityID) {
  let languageID = getCountryFromUniID(universityID).languageID;
  return LANGUAGES.find( language => language.id == languageID ).name;
} 