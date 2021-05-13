"use strict";

let addedProgrammes = [];

// function getFavoritesfromLS() {
    
// }
// exempel-data för att testa funktionen för favoriter
let favorites = [
  {
    programme: "Engineering and Sustainability",
    university: "Escuela de Estudios Superiores de Cordoba",
    id: 1,
  },
  {
    programme: "Engineering and Sustainability",
    university: "Escuela de Estudios Superiores de Cordoba",
    id: 4
  },
  {
    programme: "Engineering and Sustainability",
    university:"Escuela de Estudios Superiores de Cordoba",
    id: 3,
  },
  {
    programme: "Engineering and Sustainability",
    university: "Escuela de Estudios Superiores de Cordoba",
    id: 2,
  }
];

render("body", createHeader());

//Skapar header med sökruta
function createHeader() {
  let header = document.createElement("div");
  header.className = "header";

  let titleHeader = document.createElement("h1");
  titleHeader.textContent = "Jämför program";

  let textHeader = document.createElement("p");
  textHeader.textContent = "Här kan du jämföra dina favoriter och bestämma vilket program som är rätt för just dig!";

  let searchBar = document.createElement("input");
  searchBar.className = 'search-bar';
  searchBar.type = "list";
  searchBar.placeholder = "Lägg till program att jämföra";

  let programmeList = document.createElement("div");
  programmeList.className = "programme-list";
  programmeList.style.display = 'none';

  let favoritesContainer = document.createElement('div');
  favoritesContainer.className = 'favorites';

  let titleFavorites = document.createElement('p');
  titleFavorites.className = 'text-default, bold';
  titleFavorites.textContent = 'Favoriter';
  favoritesContainer.append(titleFavorites);

  let searchResult = document.createElement('div');
  searchResult.className = 'search-result';
    
  programmeList.append(favoritesContainer, searchResult);

  let currentProgrammes = document.createElement("div");
  currentProgrammes.className = "search-words-pills";

  searchBar.addEventListener('click', () => {
    programmeList.style.display = 'block';

    favorites.forEach(favorite => { 
      let option = createOptionsInList(favorite.programme, favorite.university);
      favoritesContainer.append(option);
      
      option.addEventListener('click', () => {
        addProgrammeToArray(favorite.id);
      });
    });
  });

  searchBar.addEventListener("keyup", () => {    
    document.querySelector('.search-result').innerHTML = '';
    
    let programmes = getSuggestionsBySearchWord(searchBar.value);
    
    programmes.forEach(programme => {
      let university = getUniversityFromUniID(programme.universityID);
      let option = createOptionsInList(programme.name, university.name);

      option.addEventListener('click', () => {
        addProgrammeToArray(programme.id);
      });

      searchResult.append(option);
    });
    
  });

  header.append(titleHeader, textHeader, currentProgrammes, searchBar, programmeList);

  return header;
}

// function renderSearchList(searchedProgrammes) {
//   render('.programme-list', searchResult);

//   searchedProgrammes.forEach(obj => {
//     let university = getUniversityFromUniID(obj.universityID);
    
//     let option = createOptionsInList(obj.name, university.name);
//     searchResult.append(option);

//     // option.addEventListener('click', () => {
//     //   addProgrammeToArray(obj.id);
//     // });
//   });
// };

function createOptionsInList(programmeName, universityName) {
  let option = document.createElement("div");
  option.className = "option";
  
  let programmeInfo = document.createElement('div');
  
  let programme = document.createElement('p');
  programme.className = 'text-default';
  programme.textContent = programmeName;
  
  let university = document.createElement('p');
  university.className = 'text-small';
  university.textContent = universityName;
  
  let addProgramme = document.createElement('i');
  addProgramme.textContent = '+';
  
  programmeInfo.append(programme, university);
  option.append(programmeInfo, addProgramme);
  
  return option;
}

function getSuggestionsBySearchWord(searchWord) {
  let programmes = DB.PROGRAMMES.filter((obj) => {
    let name = obj.name.toLowerCase();
    return name.includes(searchWord.toLowerCase());
  });

  console.log(programmes);

  return programmes;
}

// // function sortSearchResult(programmes) {
// //     programmes.sort( (obj1, obj2) => obj1.name < obj2.name ? -1 : 1 );
// //     return programmes;
// // }

function addProgrammeToArray(programmeId) {
  if (addedProgrammes.includes(programmeId)) {
    removePillFromArray(programmeId);
  } else {
    addedProgrammes.push(programmeId);
  }

  document.querySelector('.search-words-pills').innerHTML = '';

  if(addedProgrammes.length <= 5) {

  }

  addedProgrammes.forEach( id => {
    render('.search-words-pills', createPillFromProgrammeId(id));  
  });
  console.log(addedProgrammes);
}

function createPillFromProgrammeId(id) {
    let programmeName = getProgrammesById(id).name;

    let pill = document.createElement("div");
    pill.className = "pill";
  
    let pillSearchWord = document.createElement("p");
    pillSearchWord.className = "pill-search-word";
    pillSearchWord.textContent = programmeName;
  
    let removePillButton = document.createElement("button");
    removePillButton.className = "remove-pill";
    removePillButton.textContent = "X";
    removePillButton.addEventListener("click", (event) => {
      event.target.parentElement.remove();
      removePillFromArray(id);
    });
  
    pill.append(pillSearchWord, removePillButton);
    
    return pill;
  }

function removePillFromArray(programmeId) {

    for (let i = 0; i < addedProgrammes.length; i++) {
        if (addedProgrammes[i] === programmeId) {
            addedProgrammes.splice(i, 1);
        }
    }
    console.log(addedProgrammes);
}