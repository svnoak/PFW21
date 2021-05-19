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
let filteredLevels = [];
let points = 0;
let sundaysNumber = 0;
let visa = false;
let filteredLanguages = [];
let allFilterWords = [programmes, cities, levels, points, filteredLanguages];

document.getElementById("filter-btn").addEventListener("click", createFilterOptions);

function createFilterOptions() {
  let filter = document.createElement("div");
  filter.setAttribute("id", "filters");

  let closeButton = document.createElement("button");
  closeButton.setAttribute("id", "close");
  closeButton.textContent = "X";
  closeButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
  });

  let filterOptions = document.createElement("div");
  filterOptions.setAttribute("id", "filter-options");

  let levelOptions = document.createElement("div");
  levelOptions.setAttribute("id", "level-options");
  let bachelorBtn = document.createElement("div");
  bachelorBtn.setAttribute("id", "bachelor");
  bachelorBtn.textContent = "Bachelor";
  if (filteredLevels.includes("bachelor")) {
    bachelorBtn.classList.add("selected");
  }
  bachelorBtn.addEventListener("click", addLevelsToFilter);
  let masterBtn = document.createElement("div");
  masterBtn.setAttribute("id", "master");
  masterBtn.textContent = "Master";
  if (filteredLevels.includes("master")) {
    masterBtn.classList.add("selected");
  }
  masterBtn.addEventListener("click", addLevelsToFilter);
  let doctorateBtn = document.createElement("div");
  doctorateBtn.setAttribute("id", "doctorate");
  doctorateBtn.textContent = "Doctorate";
  if (filteredLevels.includes("doctorate")) {
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
    console.log(document.getElementById("points-slider").value);
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
  englishDiv.addEventListener("click", addLanguagesToFilter);
  let spanishDiv = document.createElement("div");
  spanishDiv.setAttribute("id", "spanish");
  spanishDiv.textContent = "Spanska";
  spanishDiv.addEventListener("click", addLanguagesToFilter);
  let frenchDiv = document.createElement("div");
  frenchDiv.setAttribute("id", "french");
  frenchDiv.textContent = "Franska";
  frenchDiv.addEventListener("click", addLanguagesToFilter);
  let swedishDiv = document.createElement("div");
  swedishDiv.setAttribute("id", "swedish");
  swedishDiv.textContent = "Svenska";
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
  sundays.setAttribute("id", "sundays-options");
  sundays.innerHTML = `<h4 id="points-title">Soldagar</h4>`;
  let sundaysDiv = document.createElement("div");
  let sundaysSlider = document.createElement("input");
  sundaysSlider.setAttribute("id", "sundays-slider");
  sundaysSlider.setAttribute("type", "range");
  sundaysSlider.setAttribute("min", "0");
  sundaysSlider.setAttribute("max", "365");
  sundaysSlider.value = sundaysNumber;
  sundaysSlider.addEventListener("change", () => {
    console.log(document.getElementById("sundays-slider").value);
  });
  sundaysDiv.append(sundaysSlider);
  sundaysDiv.innerHTML += `
  <p id="sundays-text">${sundaysNumber}</p>`;
  sundays.append(sundaysDiv);

  let resetBtnDiv = document.createElement("div");
  resetBtnDiv.setAttribute("id", "reset-option");
  let resetBtn = document.createElement("button");
  resetBtn.setAttribute("id", "reset");
  resetBtn.textContent = "Återställ Filter";
  resetBtnDiv.append(resetBtn);

  let showResultsBtnDiv = document.createElement("div");
  showResultsBtnDiv.setAttribute("id", "show-results");
  let showResultsBtn = document.createElement("button");
  showResultsBtn.setAttribute("id", "show-results-btn");
  showResultsBtn.textContent = "Visda resultat";
  showResultsBtnDiv.append(showResultsBtn);

  filterOptions.append(levelOptions, pointsOption, languagesDiv, visumOption, sundays, resetBtnDiv, showResultsBtnDiv);
  filter.append(closeButton, filterOptions);
  document.body.prepend(filter);
}

function addLevelsToFilter(event) {
  let targetLevel = event.target.innerHTML;
  console.log(targetLevel);
  event.target.classList.toggle("selected");
  let selectedLevels = document.querySelectorAll("#level-options > .selected");
  console.log(selectedLevels);
  filteredLevels = [];
  for (let i = 0; i < selectedLevels.length; i++) {
    filteredLevels.push(selectedLevels[i].textContent.toLocaleLowerCase());
  }
}
function addLanguagesToFilter(event) {
  let targetLaguage = event.target.innerHTML;
  console.log(targetLaguage);
  event.target.classList.toggle("selected");
  let selectedLanguage = document.querySelectorAll("#language-options > .selected");
  console.log(selectedLanguage);
  filteredLanguages = [];
  for (let i = 0; i < selectedLanguage.length; i++) {
    filteredLanguages.push(selectedLanguage[i].textContent.toLocaleLowerCase());
  }
}

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
    let cardButton = document.createElement("a");
    cardButton.href = "detail.html";
    cardButton.innerHTML = "Läs mer";
    cardButton.className = "card-button";
    cardButton.addEventListener("mouseup", () => {
      localStorage.setItem("programmeID", obj.id);
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
