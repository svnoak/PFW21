"use strict";

let programmes = [];
let cities = [];
let citiesFromCountries = [];
let countries = [];
let levels = [];

let points = 0;
let sundaysNumber = 0;
let visa = false;
let filteredLanguages = [];

let allFilterWords = [programmes, cities, levels, countries, filteredLanguages];

let params = [
  {
    id: "ciID",
    value: cities
  },
  {
    id: "coID",
    value: countries
  },
  {
    id: "liID",
    value: levels
  },
  {
    id: "piID",
    value: programmes
  },
  {
    id: "laID",
    value: filteredLanguages
  },
  {
    id: "p",
    value: points
  },
  {
    id: "v",
    value: visa
  },
  {
    id: "s",
    value: sundaysNumber
  }
]

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
              typeof(param.value) == "object" ? param.value.push(p) : param.value = p;
              switch (key) {
                case "s":
                  if (param.value > 0 ) createPillForSearchWordsOnSearchSite(`Antal soldagar: ${sundaysNumber}`);
                  break;
                case "p":
                  if (param.value > 0) createPillForSearchWordsOnSearchSite(`Antagningspoäng: ${points}`); 
                break;
                case "v":
                  if (!param.value) createPillForSearchWordsOnSearchSite(`Inklusive länder som kräver visa`);
                  break;
                default:
                  createPillForSearchWordsOnSearchSite(capitalizeFirstLetter(p));
                  break;
              }
            })
          }
        })
      }
  }
  updateView()
})

clearSearchBar();
document.getElementById("searchbar").addEventListener("keyup", getProgrammesBySearchWord);
document.getElementById("filter-btn").addEventListener("click", createFilterOptions);

function reloadUrlParams() {
  resetUrlParameter();
  setUrlParameter(params);
}

function updateView() {
  reloadUrlParams();
  window.location.search.length > 0 ?
  filterProgramme(DB.PROGRAMMES) :
  showNoProgrammesMessage();
}

function clearSearchBar() {
  document.getElementById("searchbar").value = "";
}

function updateAllFilterWords() {
  allFilterWords = [programmes, cities, levels, countries, filteredLanguages];
}

function createFilterOptions() {
  let filter = document.createElement("div");
  filter.setAttribute("id", "filters");

  let closeButton = document.createElement("button");
  closeButton.setAttribute("id", "close");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
    showResults(event);
  });

  let filterOptions = document.createElement("div");
  filterOptions.setAttribute("id", "filter-options");

  let levelOptions = document.createElement("div");
  levelOptions.setAttribute("id", "level-options");
  let bachelorBtn = document.createElement("div");
  bachelorBtn.setAttribute("id", "bachelor");
  bachelorBtn.textContent = "Bachelor";
  if (levels.includes("bachelor")) {
    bachelorBtn.classList.add("selected");
  }
  bachelorBtn.addEventListener("click", addLevelsToFilter);
  let masterBtn = document.createElement("div");
  masterBtn.setAttribute("id", "master");
  masterBtn.textContent = "Master";
  if (levels.includes("master")) {
    masterBtn.classList.add("selected");
  }
  masterBtn.addEventListener("click", addLevelsToFilter);
  let doctorateBtn = document.createElement("div");
  doctorateBtn.setAttribute("id", "doctorate");
  doctorateBtn.textContent = "Doctorate";
  if (levels.includes("doctorate")) {
    doctorateBtn.classList.add("selected");
  }
  doctorateBtn.addEventListener("click", addLevelsToFilter);

  levelOptions.append(bachelorBtn, masterBtn, doctorateBtn);

  let pointsOption = document.createElement("div");
  pointsOption.setAttribute("id", "points-option");
  pointsOption.innerHTML = `<h4 id="points-title">Antagningspoäng</h4>`;
  let pointsSliderDiv = document.createElement("div");
  pointsSliderDiv.setAttribute("id", "points-slider-div");
  pointsSliderDiv.innerHTML = `<p id="points-text">${points}</p>`;
  let pointsSlider = document.createElement("input");
  pointsSlider.setAttribute("id", "points-slider");
  pointsSlider.setAttribute("type", "range");
  pointsSlider.setAttribute("min", "0");
  pointsSlider.setAttribute("max", "10");
  pointsSlider.value = points;
  pointsSlider.addEventListener("change", () => {
    points = document.getElementById("points-slider").value;
    document.getElementById("points-text").textContent = points;
  });
  pointsSliderDiv.prepend(pointsSlider);
  pointsOption.append(pointsSliderDiv);

  let languagesDiv = document.createElement("div");
  languagesDiv.setAttribute("id", "language-options");
  let englishDiv = document.createElement("div");
  englishDiv.setAttribute("id", "english");
  englishDiv.textContent = "Engelska";
  if (filteredLanguages.includes("engelska")) {
    englishDiv.classList.add("selected");
  }
  englishDiv.addEventListener("click", addLanguagesToFilter);
  let spanishDiv = document.createElement("div");
  spanishDiv.setAttribute("id", "spanish");
  spanishDiv.textContent = "Spanska";
  if (filteredLanguages.includes("spanska")) {
    spanishDiv.classList.add("selected");
  }
  spanishDiv.addEventListener("click", addLanguagesToFilter);
  let frenchDiv = document.createElement("div");
  frenchDiv.setAttribute("id", "french");
  frenchDiv.textContent = "Franska";
  if (filteredLanguages.includes("franska")) {
    frenchDiv.classList.add("selected");
  }
  frenchDiv.addEventListener("click", addLanguagesToFilter);
  let swedishDiv = document.createElement("div");
  swedishDiv.setAttribute("id", "swedish");
  swedishDiv.textContent = "Svenska";
  if (filteredLanguages.includes("svenska")) {
    swedishDiv.classList.add("selected");
  }
  swedishDiv.addEventListener("click", addLanguagesToFilter);
  languagesDiv.append(englishDiv, spanishDiv, frenchDiv, swedishDiv);

  let visumOption = document.createElement("div");
  visumOption.setAttribute("id", "visum-options");
  visumOption.innerHTML = `
                  <div id="visum-text">Visa bara utbildningar som inte kräver Visum</div>`;
  let visumInput = document.createElement("input");
  visumInput.setAttribute("type", "checkbox");
  visumInput.setAttribute("id", "visum-checkbox");
  if (visa) {
    visumInput.checked = true;
  }
  visumInput.addEventListener("change", () => {
    visa ? (visa = false) : (visa = true);
  });
  visumOption.prepend(visumInput);

  let sundays = document.createElement("div");
  sundays.setAttribute("id", "sundays-option");
  sundays.innerHTML = `<h4 id="sundays-title">Antal Soldagar</h4>`;
  let sundaysDiv = document.createElement("div");
  sundaysDiv.setAttribute("id", "points-slider-div");
  sundaysDiv.innerHTML = `<p id="sundays-text">${sundaysNumber}</p>`;
  let sundaysSlider = document.createElement("input");
  sundaysSlider.setAttribute("id", "sundays-slider");
  sundaysSlider.setAttribute("type", "range");
  sundaysSlider.setAttribute("min", "0");
  sundaysSlider.setAttribute("max", "365");
  sundaysSlider.value = sundaysNumber;
  sundaysSlider.addEventListener("change", () => {
    sundaysNumber = document.getElementById("sundays-slider").value;
    document.getElementById("sundays-text").textContent = sundaysNumber;
  });
  sundaysDiv.prepend(sundaysSlider);
  sundays.append(sundaysDiv);

  let resetBtnDiv = document.createElement("div");
  resetBtnDiv.setAttribute("id", "reset-option");
  let resetBtn = document.createElement("button");
  resetBtn.setAttribute("id", "reset");
  resetBtn.textContent = "Återställ Filter";
  resetBtn.addEventListener("click", () => {
    let resetAllSelected = document.querySelectorAll(".selected");
    levels = [];
    filteredLanguages = [];
    resetAllSelected.forEach((obj) => {
      obj.classList.remove("selected");
    });
    visumInput.checked = false;
    visa = false;
    pointsSlider.value = 0;
    points = 0;
    document.getElementById("points-text").textContent = points;
    sundaysSlider.value = 0;
    sundaysNumber = 0;
    document.getElementById("sundays-text").textContent = sundaysNumber;
  });
  resetBtnDiv.append(resetBtn);

  let showResultsBtnDiv = document.createElement("div");
  showResultsBtnDiv.setAttribute("id", "show-results");
  let showResultsBtn = document.createElement("button");
  showResultsBtn.setAttribute("id", "show-results-btn");
  showResultsBtn.textContent = "Visa resultat";
  showResultsBtn.addEventListener("click", (event) => {
    document.getElementById("filters").remove();
    showResults(event);
  });
  showResultsBtnDiv.append(showResultsBtn);

  filterOptions.append(levelOptions, pointsOption, languagesDiv, visumOption, sundays, resetBtnDiv, showResultsBtnDiv);
  filter.append(closeButton, filterOptions);
  document.body.prepend(filter);
}

function addLevelsToFilter(event) {
  let targetLevel = event.target.innerHTML;
  event.target.classList.toggle("selected");
  levels.push(targetLevel);
  updateView();
}

function addLanguagesToFilter(event) {
  let targetLanguage = event.target.innerHTML.toLocaleLowerCase();
  filteredLanguages.push(targetLanguage);
  event.target.classList.toggle("selected");
  updateView();
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
    updateView();
    }
  }

function filterProgramme(array) {
  let passArray = [];
  if (programmes.length > 0) {
    programmes.forEach((searchWord) => {
      array.forEach((obj) => {
        if (obj.name.toLocaleLowerCase().includes(searchWord)) {
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
    filterVisa(passArray);
  } else {
    filterVisa(array);
  }
}

function filterVisa(array) {
  let passArray = [];
  if (!visa) {
    array.forEach((obj) => {
      if (!getCountryFromUniID(obj.universityID).visa) {
        passArray.push(obj);
      }
    });
    filterLanguages(passArray);
  } else {
    filterLanguages(array);
  }
}

function filterLanguages(array) {
  let passArray = [];
  if (filteredLanguages.length > 0) {
    filteredLanguages.forEach((searchWord) => {
      array.forEach((obj) => {
        if (getLanguageFromLangID(obj.language).toLocaleLowerCase().includes(searchWord)) {
          passArray.push(obj);
        }
      });
    });
    filterPoints(passArray);
  } else {
    filterPoints(array);
  }
}
function filterPoints(array) {
  let passArray = [];
  array.forEach((obj) => {
    if (obj.entryGrades[0] > points) {
      passArray.push(obj);
    }
  });
  filterSundays(passArray);
}
function filterSundays(array) {
  let passArray = [];
  array.forEach((obj) => {
    if (getCityFromUniID(obj.universityID).sun >= sundaysNumber) {
      passArray.push(obj);
    }
  });
  filterLevels(passArray);
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

function sortSearchResult(programmes) {
  let sortBy = document.getElementById("sort-by").value;
  let order = document.getElementById("order").value;
  if (sortBy == "letters" && order == "fall") {
    programmes.sort((a, b) => (a.name > b.name ? -1 : 1));
  }
  if (sortBy == "letters" && order == "rise") {
    programmes.sort((a, b) => (a.name < b.name ? -1 : 1));
  }
  if (sortBy == "points" && order == "rise") {
    programmes.sort((a, b) => (a.entryGrades[0] < b.entryGrades[0] ? -1 : 1));
  }
  if (sortBy == "points" && order == "fall") {
    programmes.sort((a, b) => (a.entryGrades[0] < b.entryGrades[0] ? 1 : -1));
  }
  createProgrammeElements("search-results", programmes);
}
document.getElementById("sort-by").addEventListener("change", () => {
  filterProgramme(DB.PROGRAMMES);
});
document.getElementById("order").addEventListener("change", () => {
  filterProgramme(DB.PROGRAMMES);
});

function showResults() {
  updateAllFilterWords();
  document.getElementById("search-words-pills").innerHTML = "";
  allFilterWords.forEach((filters) => {
    if (filters.length > 0) {
      filters.forEach((str) => {
        createPillForSearchWordsOnSearchSite(capitalizeFirstLetter(str));
      });
    }
  });
  if (sundaysNumber > 0) createPillForSearchWordsOnSearchSite(`Antal soldagar: ${sundaysNumber}`);
  if (points > 0) createPillForSearchWordsOnSearchSite(`Antagningspoäng: ${points}`);
  if (visa) createPillForSearchWordsOnSearchSite(`Kräver inte visa`);

  filterProgramme(DB.PROGRAMMES);
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
    if (removeWord.includes("antagningspoäng")) {
      points = 0;
      filterProgramme(DB.PROGRAMMES);
    }
    if (removeWord.includes("soldagar")) {
      sundaysNumber = 0;
      filterProgramme(DB.PROGRAMMES);
    }
    for (let i = 0; i < allFilterWords.length; i++) {
      allFilterWords[i].forEach((obj) => {
        if (obj.toLocaleLowerCase().includes(removeWord)) {
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
            case 4:
            index = filteredLanguages.findIndex((word) => word == removeWord);
            console.log(index);
            console.log(removeWord);
            filteredLanguages.splice(index, 1);
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
