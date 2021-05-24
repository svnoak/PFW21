"use strict";

if ( !localStorage.favoriteProgrammes ) localStorage.favoriteProgrammes = "[]";

// google-fonts
let fontStyle = document.createElement('link');
fontStyle.rel = 'stylesheet';
fontStyle.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Raleway:wght@100;200;300;400;500&display=swap';

document.head.append(fontStyle);

var searchWords = [];

const RANDOM = {
  rInt: (max, min = 0) => Math.floor(min + (max - min) * Math.random()),
  rFloat: (max, min = 0) => min + (max - min) * Math.random(),
  coin: () => Math.random() > 0.5,
  array: function (a) {
    return a[this.rInt(a.length)];
  },
};

document.addEventListener('DOMContentLoaded', function(event) {
  document.querySelector('body').style.opacity = 1
})

function getProgrammesById(id) {
  return DB.PROGRAMMES.find((obj) => obj.id == id);
}

function getProgrammesByName(programmeName) {
  return DB.PROGRAMMES.find((obj) => obj.name == programmeName);
}

function getCountryFromCountryId(countryID) {
  return DB.CITIES.find((obj) => obj.id == countryID);
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
}

function getLanguageFromUniID(universityID) {
  let languageID = getCountryFromUniID(universityID).languageID;
  return LANGUAGES.find((language) => language.id == languageID).name;
}

function render(parentElement, ...element) {
  document.querySelector(parentElement).prepend(...element);
}


// Skapar karusell
function cardCarousell(array){
  let wrapper = document.createElement("section");
  wrapper.className= `card-carousell`;

  let cardWrapperWrap = document.createElement("div");
  cardWrapperWrap.className =`hide-carousel-scroll`;

  let cardWrapper = document.createElement("div");
  cardWrapper.className = `card-wrapper`;
  let blobWrapper = document.createElement("div");
  blobWrapper.className = `blob-wrapper`;

  cardWrapperWrap.append(cardWrapper)
  wrapper.append(cardWrapperWrap, blobWrapper)

  let first = true;

  array.forEach(object =>{
      let card = document.createElement('section');
      card.append(createCard(object));
      card.className = `card`;
      cardWrapper.append(card);

      let blob = document.createElement("div");
      blob.className = `blob`;
      blobWrapper.append(blob);

      if(first){
          blob.classList.add("active");
      }

      // let location = card.getBoundingClientRect();
      cardWrapper.addEventListener("scroll", checkActive)

      function checkActive(){
          let location = card.getBoundingClientRect();

          if(location.left > 1 && location.left < 250 ){
              document.querySelector(".active").classList.remove("active");
              blob.classList.add(`active`);
          }
      }

      first = false;
      
  })

  return wrapper
}

function registerCardHeight(){
  // get height of cardwrapper
  let height = document.querySelector(".card-wrapper").clientHeight;
  document.documentElement.style.setProperty("--carousel-height", height+"px")
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
      icon: compareIcon,
    },
    {
      title: "Bokmärken",
      href: "favorites.html",
      icon: bookmarkIconNav,
    },
  ];

  let wrapper = document.createElement("nav");
  wrapper.className = `space-between`;

  navItems.forEach((item) => {
    let link = document.createElement("a");
    link.className = `column centered`;

    let icon = document.createElement("i");
    icon.className = `centered`;
    icon.innerHTML = item.icon;
    let text = document.createElement("span");
    text.className = `text-small`;
    text.textContent = item.title;
    link.append(icon, text);

    if (window.location.href.includes(item.href)) {
      link.classList.add('active');
    } else {
      link.setAttribute("href", item.href);
    }
    wrapper.append(link);
  });

  return wrapper;
}

document.body.append(DOMnav(), DOMfoot());

// footer
function DOMfoot() {
  let wrapper = document.createElement("footer");
  wrapper.className = `centered`;
  let text = document.createElement("span");
  text.className = `text-small`;
  text.textContent = `[brand] © 2021`;
  wrapper.append(text);

  return wrapper;
}

function getLanguageFromLangID(languageID) {
  return LANGUAGES.find((language) => language.id == languageID).name;
}

function resetUrlParameter() {
  let url = window.location.href.split("?")[0];
  window.history.replaceState({}, "Title", `${url}`);
}

function setUrlParameter(params) {
  params.forEach( param => {
    let condition = false;
    if (typeof(param.value) == "object")  {
      condition = param.value.length > 0;
    } else {
        condition = param.value != null;
      }
    if ( condition ) {
    if ( window.location.search.includes("?") ) {
      window.history.replaceState({}, "Title", `${window.location.href}&${param.id}=${param.value}`);
    }
    else {
      window.history.replaceState({}, "Title", `${window.location.href}?${param.id}=${param.value}`);
    }
  }
  })
}

function showNoProgrammesMessage() {
  let site = window.location.href.split("/").pop().split(".").slice(0,1)[0];
  let div = document.createElement("div");
  div.id = "nothing-here"

  let messageContent; // Vilket meddelande som ska visas
  let htmlElement; // Vilket element som ska användas för att appenda elementet ange samma som i en querySelector
  
  switch (site) {
    case "search":
      messageContent = "Du får söka för att få resultat ;)";
      htmlElement = "#search-results";
      break;
  
    case "favorites":
      messageContent = "Du har inte laggt till några favoriter :(";
      htmlElement = "#favorites";
      break;

    case "compare":
      messageContent = "Sök på de program du vill jämföra."
      htmlElement = "#comparison";
  }
  div.textContent = messageContent;
  document.querySelector(htmlElement).innerHTML = "";
  render( htmlElement, div );
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createProgrammeElements(id ,programmes) {
  document.getElementById(id).innerHTML = "";
  programmes.forEach((obj) => {
    let searchResultCard = document.createElement("div");
    searchResultCard.className = "search-result-card";

    let bookmark = document.createElement("div");
    bookmark.className = `bookmark`;
    parseFavoritesFromLS().find(fav => parseInt(fav) == parseInt(obj.id)) >= 0 ?
    bookmark.innerHTML = bookmarkIconFilled :
    bookmark.innerHTML = bookmarkIcon;
    bookmark.setAttribute("programmeID", obj.id);
    bookmark.addEventListener("click", saveBookmarked);

    let programmeImage = document.createElement("div");
    programmeImage.style.backgroundImage = `url(assets/images/${getCityImgFromUniID(obj.universityID)})`;
    programmeImage.className = "programme-image";

    let programmeCardInfo = document.createElement("div");
    programmeCardInfo.className = "programme-card-info";

    let programmeCardTitle = document.createElement("h3");
    programmeCardTitle.innerHTML = obj.name;
    programmeCardTitle.className = "text-default bold";

    let programmeCardSchool = document.createElement("div");
    programmeCardSchool.className = "programme-card-school";
    let cardSchool = document.createElement("p");
    cardSchool.className = "card-school text-small light";
    cardSchool.innerHTML = getUniversityFromUniID(obj.universityID).name;
    programmeCardSchool.innerHTML = homeIcon;
    programmeCardSchool.append(cardSchool);

    let programmeCardCity = document.createElement("div");
    programmeCardCity.className = "programme-card-city";
    let cardCity = document.createElement("p");
    cardCity.className = "card-city text-small light";
    cardCity.innerHTML = `${getCityFromUniID(obj.universityID).name}, ${getCountryFromUniID(obj.universityID).name}`;
    programmeCardCity.innerHTML = locationIcon;
    programmeCardCity.append(cardCity);

    let programmeCardLevelAndpoints = document.createElement("div");
    let levelDiv = document.createElement("div");
    levelDiv.className = "flex-row";
    let cardLevel = document.createElement("p");
    cardLevel.className = "card-level text-small light";
    cardLevel.innerHTML = getLevel(obj.level);
    levelDiv.innerHTML = lvlIcon;
    levelDiv.append(cardLevel);
    let pointsDiv = document.createElement("div");
    pointsDiv.className = "flex-row";
    let cardPoints = document.createElement("p");
    cardPoints.className = "card-level text-small light";
    cardPoints.innerHTML = `Antagningspoäng ${obj.entryGrades[0]}`;
    pointsDiv.innerHTML = lvlIcon;
    pointsDiv.append(cardPoints);
    programmeCardLevelAndpoints.append(levelDiv, pointsDiv);

    let cardButtonDiv = document.createElement("div");
    let cardButton = document.createElement("a");
    cardButton.href = `detail.html?programmeID=${obj.id}`;
    cardButton.innerHTML = "Läs mer >";
    cardButton.className = "card-button text-default light";

    cardButtonDiv.append(cardButton);
    cardButtonDiv.className = "card-button-div";

    programmeCardInfo.append(
      programmeCardTitle,
      programmeCardSchool,
      programmeCardCity,
      programmeCardLevelAndpoints,
      cardButtonDiv
    );

    searchResultCard.append(programmeImage, bookmark, programmeCardInfo);

    render(`#${id}`, searchResultCard);
  });
}

/*
function createProgrammeElements(id ,programmes) {
  document.getElementById(id).innerHTML = "";
  programmes.forEach((obj) => {
    let ResultCard = document.createElement("div");
    ResultCard.className = "search-result-card";

    let bookmark = document.createElement("div");
    bookmark.className = `bookmark`;
    parseFavoritesFromLS().find(fav => parseInt(fav) == parseInt(obj.id)) >= 0 ?
    bookmark.innerHTML = bookmarkIconFilled :
    bookmark.innerHTML = bookmarkIcon;
    bookmark.setAttribute("programmeID", obj.id);
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
    programmeCardCity.innerHTML = locationIcon;
    programmeCardCity.append(cardCity);

    let programmeCardLevelAndDate = document.createElement("div");
    let levelDiv = document.createElement("div");
    levelDiv.className = "flex-row";
    let cardLevel = document.createElement("p");
    cardLevel.className = "card-level";
    cardLevel.innerHTML = getLevel(obj.level);
    levelDiv.innerHTML = lvlIcon;
    levelDiv.append(cardLevel);
    programmeCardLevelAndDate.append(levelDiv);

    let cardButtonDiv = document.createElement("div");
    let cardButton = document.createElement("a");
    cardButton.href = `detail.html?programmeID=${obj.id}`;
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

    ResultCard.append(programmeImage, bookmark, programmeCardInfo);
    render(`#${id}`, ResultCard);
  });
}*/

function createCompareInfo(title, text, centered = false, circleBackground = true){
  let wrapper = document.createElement('section');
  wrapper.className = 'compare-info-section centered';

  let titleEl = document.createElement('h2');
  titleEl.className = 'title-default regular'
  titleEl.textContent = title;

  let textEl = document.createElement('p');
  textEl.className = 'text-default regular';
  textEl.textContent = text;

  let buttonContainer = document.createElement('div');
  buttonContainer.className = 'c-button-container';
  if (centered) buttonContainer.classList.add("centered");
  let button = document.createElement('a');
  button.href = 'compare.html';
  button.className = 'text-default light space-between button-solid--cream button-square';
  button.innerHTML = `<p>Jämför program</p><i class="centered">${trailingIconRight}</i>`;
  buttonContainer.append(button);

  console.log(circleBackground)
  if ( circleBackground ) {
    let circleContainer = createBackgroundCircle();
    circleContainer.className = 'c-container bottom';
    wrapper.append(circleContainer)
  }

  wrapper.prepend(titleEl, textEl, buttonContainer);

  return wrapper;
}

function parseFavoritesFromLS(type /*"id" or "object"*/) {
  let programmes = [];
  let programmIDs = localStorage.favoriteProgrammes.length > 0 ? JSON.parse(localStorage.favoriteProgrammes) : [];
  switch (type) {
    case "object":
      programmIDs.forEach( id => programmes.push(getProgrammesById(id)));
      break;
  
    default:
      programmIDs.forEach( id => programmes.push(id));
      break;
  }
  return programmes;
}

function saveBookmarked(event) {
  let id = parseInt(event.target.attributes[1].nodeValue);
  let target = event.target;
  let bookmarkIDs = parseFavoritesFromLS();
  console.log(id);
  parseFavoritesFromLS().find(fav => fav == id ) || parseFavoritesFromLS().find(fav => fav == id ) == 0 ?
  removeBookmarkFromLS(bookmarkIDs, id, target) :
  addBookmarksToLS(bookmarkIDs, id, target); 
}

function addBookmarksToLS(bookmarks, id, target) {
  console.log(target);
  target.innerHTML = bookmarkIconFilled;
  bookmarks.push(parseInt(id));
  localStorage.setItem("favoriteProgrammes", JSON.stringify(bookmarks));
}

async function removeBookmarkFromLS(bookmarks, id, target) {
  if ( window.location.href.includes("favorite") ){
    if ( await removeBookmark() ){
      remove(bookmarks, id, target);
      target.parentElement.remove();
    }
}
  else {
    remove(bookmarks, id, target);  
  }

  function remove(bookmarks, id, target) {
    target.innerHTML = bookmarkIcon;
    bookmarks = bookmarks.filter( mark => parseInt(mark) != id );
    localStorage.setItem("favoriteProgrammes", JSON.stringify(bookmarks));
  }
}

function removeBookmark() {
  return new Promise( confirm => {
    swal({
      title: "Vill du radera favoriten?",
      // icon: "warning",
      buttons: {
          cancel: {
            text: "Nej",
            value: false,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Ja",
            value: true,
            visible: true,
            className: "",
            closeModal: true
          }
      }
    })
    .then((value) => {
      confirm(value);
});
  })
}

function createBackgroundCircle() {
  let circleContainer = document.createElement('div');
  let circle = document.createElement('div');
  circle.className = 'circle';
  circleContainer.append(circle);
  circle.style.height = '140vw';
  circle.style.width = '140vw';

  return circleContainer;
}

function makeAd(size = "random") {
  //creates random
  let ads = [
    'annons_horizontell.jpg',
    'annons_kvadratisk.jpg'
  ];
  let chosen = ads[RANDOM.rInt(ads.length)];

  // if want specific size
  if(size !== "random"){
    if(size[1] == "k"){
      chosen = ads.find(ad => ad.includes(size));
    } else {
      chosen = ads.find(ad => ad.includes(size));
    }
  }

  let wrapper = document.createElement("div");
  wrapper.className = `ad ad-random`;
  if(chosen.includes("horiz")){
    wrapper.className = `ad ad-hori`;
  } else if (chosen.includes("kvad")){
    wrapper.className = `ad ad-kvad`;
  }
  let text = document.createElement("div");
  text.textContent = `Detta är en annons`;
  let ad = document.createElement("img");
  wrapper.append(text, ad)
  ad.setAttribute('src', `assets/ads/${chosen}`)

  return wrapper
}
