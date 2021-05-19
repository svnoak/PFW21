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
  return DB.FIELDS.find((obj) => obj.id == subjectID).name.toLocaleLowerCase();
  return DB.FIELDS.find((obj) => obj.id == subjectID).name;
}

function render(parentElement, ...element) {
  document.querySelector(parentElement).append(...element);
}

// Menu
function DOMnav() {
  let navItems = [
    {
      title: "Startsida",
      href: "index.html",
      icon: homeIcon,
    },
    {
      title: "Sök",
      href: "search.html",
      icon: searchIcon,
    },
    {
      title: "Jämför",
      href: "compare.html",
      icon: arrowsIcon,
    },
    {
      title: "Bokmärken",
      href: "favorites.html",
      icon: bookmarkIcon,
    },
  ];

  let wrapper = document.createElement("nav");

  navItems.forEach((item) => {
    let link = document.createElement("a");

    let icon = document.createElement("i");
    icon.innerHTML = item.icon;
    let text = document.createElement("span");
    text.textContent = item.title;
    link.append(icon, text);

    if (window.location.href.includes(item.href)) {
      link.className = `active`;
    } else {
      link.setAttribute("href", item.href);
    }
    wrapper.append(link);
  });

  return wrapper;
}

document.body.append(DOMnav());

// footer
function DOMfoot() {
  let wrapper = document.createElement("footer");
  let text = document.createElement("span");
  text.textContent = `[brand] © 2021`;
  wrapper.append(text);

  return wrapper;
}

function getLanguageFromUniID(universityID) {
  let languageID = getCountryFromUniID(universityID).languageID;
  return LANGUAGES.find((language) => language.id == languageID).name;
}

function resetUrlParameter() {
  let url = window.location.href.split("?")[0];
  window.history.replaceState({}, "Title", `${url}`);
}

function setUrlParameter(string, key) {
  window.history.replaceState({}, "Title", `${window.location.href}?${key}=${string}`);
}

function createProgrammeElements(id ,programmes) {
  document.getElementById(id).innerHTML = "";
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
    let cardButton = document.createElement("a");
    cardButton.href = 'detail.html';
    cardButton.innerHTML = "Läs mer";
    cardButton.className = "card-button";
    cardButton.addEventListener('mouseup', () => {
      localStorage.setItem('programmeID', obj.id);
    });

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

    render(`#${id}`, searchResultCard);
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
