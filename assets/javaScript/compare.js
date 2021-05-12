"use strict";

let addedProgrammes = [];

render("body", createHeader());

function createHeader() {
  let header = document.createElement("div");
  header.className = "header";

  let titleHeader = document.createElement("h1");
  titleHeader.textContent = "Jämför program";

  let textHeader = document.createElement("p");
  textHeader.textContent = "Här kan du jämföra dina favoriter och bestämma vilket program som är rätt för just dig!";

  let searchBar = document.createElement("input");
  searchBar.type = "list";
  searchBar.placeholder = "Lägg till program att jämföra";

  let currentProgrammes = document.createElement("div");
  currentProgrammes.className = "search-words-pills";

  searchBar.addEventListener("keyup", () => {
    let searchInput = searchBar.value.toLowerCase();

    if (document.querySelector(".datalist")) {
      document.querySelector(".datalist").remove();
    }

    let programmeList = document.createElement("div");
    programmeList.className = "programmelist";
    searchBar.after(programmeList);
    
    getSuggestionsBySearchWord(searchInput).forEach((programme) => {
        let university = getUniversityFromUniID(programme.universityID);

        let option = document.createElement("div");
        option.className = "option";
        
        let programmeInfo = document.createElement('div');
        
        let programmeName = document.createElement('p');
        programmeName.className = 'text-default';
        programmeName.textContent = programme.name;
        
        let universityName = document.createElement('p');
        universityName.className = 'text-small';
        universityName.textContent = university.name;
        
        let addProgramme = document.createElement('i');
        addProgramme.textContent = '+';
        
        programmeInfo.append(programmeName, universityName);
        option.append(programmeInfo, addProgramme);
        programmeList.append(option);

        option.addEventListener("click", () => {
            addProgrammeToArray(programme.id);
      });
    });
  });

  header.append(titleHeader, textHeader, currentProgrammes, searchBar);

  return header;
}

function getSuggestionsBySearchWord(searchWord) {
  if (searchWord === "") {
    return;
  }

  let programmes = DB.PROGRAMMES.filter((obj) => {
    let name = obj.name.toLowerCase();
    return name.includes(searchWord);
  });

  // sortSearchResult(programmes);
  return programmes;
}

function sortSearchResult(programmes) {
    // programmes.sort()
    console.log(programmes);
    return programmes;
}

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