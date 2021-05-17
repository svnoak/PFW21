"use strict";

const RANDOM = {
  rInt: (max, min = 0) => Math.floor(min + (max - min) * Math.random()),
  rFloat: (max, min = 0) => min + (max - min) * Math.random(),
  coin: () => Math.random() > 0.5,
  array: function (a) {
    return a[this.rInt(a.length)];
  },
};

function getUniversityFromUniID(universityID) {
  return DB.UNIVERSITIES.find((obj) => obj.id === universityID);
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
  let cityID = DB.UNIVERSITIES.find((obj) => obj.id === universityID).cityID;
  return DB.CITIES.find((obj) => obj.id === cityID);
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

// Skapar karusell
function cardCarousell(array){
  let wrapper = document.createElement("section");
  wrapper.className= `card-carousell`;

  let cardWrapper = document.createElement("div");
  cardWrapper.className = `card-wrapper`;
  let blobWrapper = document.createElement("div");
  blobWrapper.className = `blob-wrapper`;

  wrapper.append(cardWrapper, blobWrapper)

  let first = true;

  array.forEach(object =>{
      let card = createCard(object);
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