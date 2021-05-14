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

// Menu
function DOMnav () {
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
    
  ]

  let wrapper = document.createElement("nav");

  navItems.forEach( item => {
    let link = document.createElement("a");

    let icon = document.createElement("i");
    icon.innerHTML = item.icon;
    let text = document.createElement("span");
    text.textContent = item.title;
    link.append(icon, text)

    if (window.location.href.includes(item.href)){
      link.className = `active`;
    } else {
      link.setAttribute("href", item.href);
    }
    wrapper.append(link)
  })

  return wrapper
}

document.body.append(DOMnav())

// footer
function DOMfoot(){
  let wrapper = document.createElement("footer");
  let text = document.createElement("span");
  text.textContent = `[brand] © 2021`;
  wrapper.append(text)

  return wrapper
}
