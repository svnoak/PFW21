"use strict";

let programmes = [];
let cities = [];
let citiesFromCountries = [];
let countries = [];
let levels = [];

let points = 0;
let sundaysNumber = 0;
let visa = true;
let filteredLanguages = [];

let allFilterWords = [programmes, cities, levels, countries, filteredLanguages];

let numberOfAds = 3;

let params = [
  {
    id: "ciID",
    value: cities,
  },
  {
    id: "coID",
    value: countries,
  },
  {
    id: "liID",
    value: levels,
  },
  {
    id: "piID",
    value: programmes,
  },
  {
    id: "laID",
    value: filteredLanguages,
  },
  {
    id: "p",
    value: points,
  },
  {
    id: "v",
    value: visa,
  },
  {
    id: "s",
    value: sundaysNumber,
  },
];

function updateParams(id, value) {
  params.forEach((param) => (param.id == id ? (param.value = value) : false));
}

window.addEventListener("load", () => {
  if (sessionStorage.search)
    window.history.replaceState({}, "Title", `${window.location.href}${sessionStorage.search}`);
  window.history.replaceState({}, "Title", `${window.location.href}${sessionStorage.search}`);
  reloadUrlParams();
  let urlParameters = window.location.search.split(/\?|=|\&/).slice(1);
  let key;

  for (let i = 0; i < urlParameters.length; i++) {
    let x = i + 1;
    key = urlParameters[i];
    if (params.find((param) => param.id == key)) {
      params.forEach((param) => {
        if (param.id == key) {
          urlParameters[x].split(",").forEach((p) => {
            if (typeof param.value == "object") {
              p.includes("%20") ? (p = p.replace("%20", " ")) : false;
              param.value.push(p);
            } else {
              param.value = p;
            }
            switch (key) {
              case "s":
                if (param.value > 0) {
                  createPillForSearchWordsOnSearchSite(`Antal soldagar: ${param.value}`);
                  sundaysNumber = param.value;
                }
                break;
              case "p":
                if (param.value > 0) {
                  createPillForSearchWordsOnSearchSite(`Antagningspoäng: ${param.value}`);
                  points = param.value;
                }
                break;
              case "v":
                if (param.value == "false") {
                  createPillForSearchWordsOnSearchSite(`Kräver inte visa`);
                  visa = param.value;
                }
                break;
              default:
                createPillForSearchWordsOnSearchSite(capitalizeFirstLetter(p));
                break;
            }
          });
        }
      });
    }
  }
  updateView();
});

clearSearchBar();
document.getElementById("searchbar").addEventListener("keyup", getProgrammesBySearchWord);
document.getElementById("filter-btn").addEventListener("click", () => {
  document.body.className = 'noScroll';
  createFilterOptions();
});

let circleContainer = createBackgroundCircle();
circleContainer.className = "c-container bottom";
render("#main", circleContainer);

function reloadUrlParams() {
  resetUrlParameter();
  setUrlParameter(params);
  sessionStorage.setItem("search", window.location.search);
}

function updateView() {
  reloadUrlParams();
  window.location.search.length > 0 ? filterProgramme(DB.PROGRAMMES) : showNoProgrammesMessage();
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
  filter.className = "centered column";

  let closeButton = document.createElement("i");
  closeButton.setAttribute("id", "close");
  closeButton.innerHTML = plusIcon;
  closeButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
    document.body.classList.remove('noScroll');
    showResults(event);
  });

  let filterOptions = document.createElement("div");
  filterOptions.setAttribute("id", "filter-options");
  filterOptions.classList.add("centered", "column");

  let levelOptions = document.createElement("div");
  levelOptions.setAttribute("id", "level-options");
  let bachelorBtn = document.createElement("div");
  bachelorBtn.setAttribute("id", "bachelor");
  bachelorBtn.className = "text-default";
  bachelorBtn.textContent = "Bachelor";
  if (levels.includes("bachelor")) {
    bachelorBtn.classList.add("selected");
  }
  bachelorBtn.addEventListener("click", addKeyToFilter);
  let masterBtn = document.createElement("div");
  masterBtn.setAttribute("id", "master");
  masterBtn.className = "text-default";
  masterBtn.textContent = "Master";
  if (levels.includes("master")) {
    masterBtn.classList.add("selected");
  }
  masterBtn.addEventListener("click", addKeyToFilter);
  let doctorateBtn = document.createElement("div");
  doctorateBtn.setAttribute("id", "doctorate");
  doctorateBtn.className = "text-default";
  doctorateBtn.textContent = "Doctorate";
  if (levels.includes("doctorate")) {
    doctorateBtn.classList.add("selected");
  }
  doctorateBtn.addEventListener("click", addKeyToFilter);

  levelOptions.append(bachelorBtn, masterBtn, doctorateBtn);

  let pointsOption = document.createElement("div");
  pointsOption.setAttribute("id", "points-option");
  pointsOption.innerHTML = `<h4 id="points-title" class="text-large">Antagningspoäng (1-10): ${points} poäng</h4>`;
  let pointsSliderDiv = document.createElement("div");
  pointsSliderDiv.setAttribute("id", "points-slider-div");
  let pointsSlider = document.createElement("input");
  pointsSlider.setAttribute("id", "points-slider");
  pointsSlider.setAttribute("type", "range");
  pointsSlider.setAttribute("min", "0");
  pointsSlider.setAttribute("max", "10");
  pointsSlider.value = points;
  pointsSlider.addEventListener("change", () => {
    points = document.getElementById("points-slider").value;
    document.getElementById("points-title").textContent = `Antagningspoäng (1-10): ${points} poäng`;
    updateParams("p", points);
  });
  pointsSliderDiv.prepend(pointsSlider);
  pointsOption.append(pointsSliderDiv);

  let languagesDiv = document.createElement("div");
  languagesDiv.setAttribute("id", "language-options");
  let englishDiv = document.createElement("div");
  englishDiv.setAttribute("id", "english");
  englishDiv.className = "text-default button-stroke--blue button-round";
  englishDiv.textContent = "Engelska";
  if (filteredLanguages.includes("english")) {
    englishDiv.classList.add("selected");
  }
  englishDiv.addEventListener("click", addKeyToFilter);
  let spanishDiv = document.createElement("div");
  spanishDiv.setAttribute("id", "spanish");
  spanishDiv.textContent = "Spanska";
  spanishDiv.className = "text-default button-stroke--blue button-round";
  if (filteredLanguages.includes("spanish")) {
    spanishDiv.classList.add("selected");
  }
  spanishDiv.addEventListener("click", addKeyToFilter);
  let frenchDiv = document.createElement("div");
  frenchDiv.setAttribute("id", "french");
  frenchDiv.className = "text-default button-stroke--blue button-round";
  frenchDiv.textContent = "Franska";
  if (filteredLanguages.includes("french")) {
    frenchDiv.classList.add("selected");
  }
  frenchDiv.addEventListener("click", addKeyToFilter);
  let swedishDiv = document.createElement("div");
  swedishDiv.setAttribute("id", "swedish");
  swedishDiv.className = "text-default button-stroke--blue button-round";
  swedishDiv.textContent = "Svenska";
  if (filteredLanguages.includes("swedish")) {
    swedishDiv.classList.add("selected");
  }
  swedishDiv.addEventListener("click", addKeyToFilter);
  languagesDiv.append(englishDiv, spanishDiv, frenchDiv, swedishDiv);

  let visumOption = document.createElement("div");
  visumOption.setAttribute("id", "visum-options");
  visumOption.innerHTML = `
                  <div id="visum-text" class="text-default">Visa bara utbildningar som inte kräver Visum</div>`;
  let visumInput = document.createElement("input");
  visumInput.setAttribute("type", "checkbox");
  visumInput.setAttribute("id", "visum-checkbox");
  if (visa == "false") {
    visumInput.checked = true;
  }
  visumInput.addEventListener("change", () => {
    visa ? (visa = false) : (visa = true);
    updateParams("v", visa);
  });
  visumOption.prepend(visumInput);

  let sundays = document.createElement("div");
  sundays.setAttribute("id", "sundays-option");
  sundays.innerHTML = `<h4 id="sundays-title" class="text-large">Antal Soldagar (0-365): ${sundaysNumber} dagar</h4>`;
  let sundaysDiv = document.createElement("div");
  sundaysDiv.setAttribute("id", "points-slider-div");
  let sundaysSlider = document.createElement("input");
  sundaysSlider.setAttribute("id", "sundays-slider");
  sundaysSlider.setAttribute("type", "range");
  sundaysSlider.setAttribute("min", "0");
  sundaysSlider.setAttribute("max", "365");
  sundaysSlider.value = sundaysNumber;
  sundaysSlider.addEventListener("change", () => {
    sundaysNumber = document.getElementById("sundays-slider").value;
    document.getElementById("sundays-title").textContent = `Antal Soldagar(0-365): ${sundaysNumber} dagar`;
    updateParams("s", sundaysNumber);
  });
  sundaysDiv.prepend(sundaysSlider);
  sundays.append(sundaysDiv);

  let resetBtnDiv = document.createElement("div");
  resetBtnDiv.setAttribute("id", "reset-option");
  let resetBtn = document.createElement("button");
  resetBtn.setAttribute("id", "reset");
  resetBtn.className = "text-default button-stroke--blue button-round";
  resetBtn.textContent = "Återställ Filter";
  resetBtn.addEventListener("click", () => {
    let resetAllSelected = document.querySelectorAll(".selected");
    levels = [];
    filteredLanguages = [];
    resetAllSelected.forEach((obj) => {
      obj.classList.remove("selected");
    });
    visumInput.checked = false;
    pointsSlider.value = 0;
    points = 0;
    document.getElementById("points-title").textContent = `Antagningspoäng (1-10): ${points} poäng`;
    sundaysSlider.value = 0;
    sundaysNumber = 0;
    document.getElementById("sundays-title").textContent = `Antal Soldagar(0-365): ${sundaysNumber} dagar`;
  });
  resetBtnDiv.append(resetBtn);

  let showResultsBtnDiv = document.createElement("div");
  showResultsBtnDiv.setAttribute("id", "show-results");
  let showResultsBtn = document.createElement("div");
  showResultsBtn.setAttribute("id", "show-results-btn");
  showResultsBtn.className = "text-large light-color-text";
  showResultsBtn.textContent = `Visa utbildningar`;
  showResultsBtn.addEventListener("click", (event) => {
    document.getElementById("filters").remove();
    document.body.classList.remove('noScroll');
    showResults(event);
  });
  showResultsBtnDiv.append(showResultsBtn);

  filterOptions.append(levelOptions, pointsOption, languagesDiv, visumOption, sundays, resetBtnDiv, showResultsBtnDiv);
  filter.append(closeButton, filterOptions);
  document.body.prepend(filter);
}

function addKeyToFilter(event) {
  let target = event.target.id;
  event.target.classList.toggle("selected");
  if (!event.target.classList.contains("selected")) {
    removeSearchWord(target);
  } else {
    let key = event.target.parentElement.id.split("-")[0];
    key == "level" ? levels.push(target) : filteredLanguages.push(target);
  }
}

function getProgrammesBySearchWord(event) {
  if (event.keyCode == 13 && this.value.length > 0) {
    let input = this.value.toLocaleLowerCase();
    searchWords.push(input);
    let inc = [];
    inc = allFilterWords.filter((array) => array.includes(input));
    if (inc.length == 0) {
      createPillForSearchWordsOnSearchSite(capitalizeFirstLetter(this.value));
      if (DB.PROGRAMMES.some((obj) => getCityFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))) {
        cities.push(input);
      } else if (
        DB.PROGRAMMES.some((obj) => getCountryFromUniID(obj.universityID).name.toLocaleLowerCase().includes(input))
      ) {
        countries.push(input);
      } else if (DB.PROGRAMMES.some((obj) => getLevel(obj.level).toLocaleLowerCase().includes(input))) {
        levels.push(input);
      } else if (DB.PROGRAMMES.some((obj) => getLanguageFromLangID(obj.language).toLocaleLowerCase().includes(input))) {
        filteredLanguages.push(input);
      } else if (DB.PROGRAMMES.some((obj) => obj.name.toLocaleLowerCase().includes(input))) {
        programmes.push(input);
      }
      updateView();
    }
    clearSearchBar();
  }
}

function filterProgramme(array) {
  let filterExists = allFilterWords.filter((a) => a.length > 0).length;
  filterExists > 0 ? (filterExists = true) : (filterExists = false);
  if (filterExists || points > 0 || visa == false || sundaysNumber > 0) {
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
    programmes.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  if (sortBy == "letters" && order == "rise") {
    programmes.sort((a, b) => (a.name < b.name ? 1 : -1));
  }
  if (sortBy == "points" && order == "rise") {
    programmes.sort((a, b) => (a.entryGrades[0] < b.entryGrades[0] ? 1 : -1));
  }
  if (sortBy == "points" && order == "fall") {
    programmes.sort((a, b) => (a.entryGrades[0] < b.entryGrades[0] ? -1 : 1));
  }
  addAdsToResults(programmes);
}
document.getElementById("sort-by").addEventListener("change", () => {
  filterProgramme(DB.PROGRAMMES);
});
document.getElementById("order").addEventListener("change", () => {
  filterProgramme(DB.PROGRAMMES);
});

function addAdsToResults(programmes) {
  for (let i = 0; i < numberOfAds; i++) {
    programmes.splice(RANDOM.rInt(programmes.length, 3), 0, makeAd());
  }

  console.log(programmes);
  createProgrammeElements("search-results", programmes);
}

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
  if (!visa) createPillForSearchWordsOnSearchSite(`Kräver inte visa`);

  updateView();
}

function createPillForSearchWordsOnSearchSite(searchWord, parentElement = "#search-words-pills") {
  let pill = document.createElement("div");
  pill.className = "pill";

  let pillSearchWord = document.createElement("p");
  pillSearchWord.className = "pill-search-word text-small";
  pillSearchWord.textContent = searchWord;

  let removePillButton = document.createElement("button");
  removePillButton.className = "remove-pill text-small bold";
  removePillButton.innerHTML = removeIcon;
  removePillButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
    let removeWord = event.target.previousSibling.innerHTML.toLocaleLowerCase();
    removeSearchWord(removeWord);
  });
  pill.append(pillSearchWord, removePillButton);
  render(parentElement, pill);
}

function removeSearchWord(removeWord) {
  if (removeWord.includes("antagningspoäng")) {
    points = 0;
    filterProgramme(DB.PROGRAMMES);
    updateParams("p", points);
    reloadUrlParams();
  }
  if (removeWord.includes("visa")) {
    visa = true;
    filterProgramme(DB.PROGRAMMES);
    updateParams("v", visa);
    reloadUrlParams();
  }
  if (removeWord.includes("soldagar")) {
    sundaysNumber = 0;
    updateParams("s", sundaysNumber);
    filterProgramme(DB.PROGRAMMES);
    reloadUrlParams();
  }
  for (let i = 0; i < allFilterWords.length; i++) {
    allFilterWords[i].forEach((obj) => {
      if (obj.toLocaleLowerCase().includes(removeWord)) {
        let index = 0;
        switch (i) {
          case 0:
            index = programmes.findIndex((word) => word == removeWord);
            programmes.splice(index, 1);
            reloadUrlParams();
            break;
          case 1:
            index = cities.findIndex((word) => word == removeWord);
            cities.splice(index, 1);
            reloadUrlParams();
            break;
          case 2:
            index = levels.findIndex((word) => word == removeWord);
            levels.splice(index, 1);
            reloadUrlParams();
            break;
          case 3:
            index = countries.findIndex((word) => word == removeWord);
            countries.splice(index, 1);
            reloadUrlParams();
            break;
          case 4:
            index = filteredLanguages.findIndex((word) => word == removeWord);
            filteredLanguages.splice(index, 1);
            reloadUrlParams();
            break;
          default:
            break;
        }
        updateView();
      }
    });
  }
}
