"use strict";

let programmes = [];

let programmIDs = JSON.parse(localStorage.favoriteProgrammes);
programmIDs.forEach( id => programmes.push(getProgrammesById(id)));

function createProgrammeElements(programmes) {
    document.getElementById("favourites").innerHTML = "";
    programmes.forEach((obj) => {
        console.log(obj);
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
      cardButton.addEventListener('click', () => {
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
  
      render("#favourites", searchResultCard);
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

createProgrammeElements(programmes);