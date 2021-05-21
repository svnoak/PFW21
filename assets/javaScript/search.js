"use strict";

clearSearchBar();
document.getElementById("searchbar").addEventListener("keyup", getProgrammesBySearchWord);

function clearSearchBar() {
  document.getElementById("searchbar").value = "";
}

function updateView() {
  reloadUrlParams();
  window.location.search.length > 0 ?
  filterProgramme(DB.PROGRAMMES) :
  showNoProgrammesMessage();
}

window.addEventListener("load", () => {
  let urlParameters = window.location.search.split(/\?|=|\&/).slice(1);
  let key;
  for( let i = 0; i < urlParameters.length; i++ ) {
      let x = i+1;
      key = urlParameters[i];
      if ( params.find( param => param.id == key ) ) {
        params.forEach( param => {
          if (param.id == key) {
            urlParameters[x].split(",").forEach( p => {
              param.array.push(p) 
              createPillForSearchWordsOnSearchSite(p);
            })
          }
        })
      }
  }
  updateView()
})

let programmes = [];
let cities = [];
let countries = [];
let levels = [];
let allFilterWords = [programmes, cities, levels, countries];
let params = [
    {
      id: "ciID",
      array: cities
    },
    {
      id: "coID",
      array: countries
    },
    {
      id: "liID",
      array: levels
    },
    {
      id: "piID",
      array: programmes
    }
  ]

  function reloadUrlParams() {
    resetUrlParameter();
    setUrlParameter(params);
  }

function getProgrammesBySearchWord(event) {
  if (event.keyCode == 13 && this.value.length > 0) {
    let input = this.value.toLocaleLowerCase();
    searchWords.push(input);
    createPillForSearchWordsOnSearchSite(this.value);
    clearSearchBar();
    
    if (DB.PROGRAMMES.some((obj) => getCityFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))) {
        cities.push(input);
    } else if (DB.PROGRAMMES.some((obj) => getCountryFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))) {
        countries.push(input);
    } else if (DB.PROGRAMMES.some((obj) => getLevel(obj.level).toLocaleLowerCase().includes(input))) { 
        levels.push(input); 
    } else if (DB.PROGRAMMES.some((obj) => obj.name.toLocaleLowerCase().includes(input))) {
        programmes.push(input);
    }
    reloadUrlParams();
    updateView();
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

createProgrammeElements("search-results", programmes);

function sortSearchResult(programmes) {
  createProgrammeElements("search-results", programmes);
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
              updateView();
              break;
            case 1:
              index = cities.findIndex((word) => word == removeWord);
              cities.splice(index, 1);
              updateView();
              break;
            case 2:
              index = levels.findIndex((word) => word == removeWord);
              levels.splice(index, 1);
              updateView();
              break;
            case 3:
              index = countries.findIndex((word) => word == removeWord);
              countries.splice(index, 1);
              updateView();
              break;
            default:
              break;
          }
          reloadUrlParams();
        }
      });
    }
  });
  pill.append(pillSearchWord, removePillButton);
  render(parentElement, pill);
}
