"use strict";

let addedProgrammes = [];

render("body", createHeader(), createComparisonSection(298));

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

    let dataList = document.createElement("div");
    dataList.className = "datalist";
    searchBar.after(dataList);

    getProgrammesBySearchWord(searchInput).forEach((programme) => {
        let university = getUniversityFromUniID(programme.universityID);
        
        let option = document.createElement("div");
        option.className = "option";
        option.innerHTML = `
        <p class="text-default">${programme.name}</p>
        <p class="text-small">${university.name}</p>
        `;
        dataList.append(option);

        option.addEventListener("click", () => {
            addProgrammeToList(programme.id);
      });
    });
  });

  header.append(titleHeader, textHeader, currentProgrammes, searchBar);

  return header;
}

function getProgrammesBySearchWord(searchInput) {
  if (searchInput === "") {
    return;
  }

  let programmes = DB.PROGRAMMES.filter((obj) => {
    let name = obj.name.toLowerCase();
    return name.includes(searchInput);
  });

  // sortSearchResult(programmes);
  return programmes;
}

function sortSearchResult(programmes) {
  return programmes;
}

function addProgrammeToList(programID) {
  if (addedProgrammes.includes(programID)) {
    return;
  } else {
    addedProgrammes.push(programID);
  }

  document.querySelector('.search-words-pills').innerHTML = '';

  addedProgrammes.forEach( id => {
    let programme = getProgrammesById(id);

    createPillForSearchWords(programme.name, '.search-words-pills');
  });
  console.log(addedProgrammes);
}

function removePillFromArray(programmeName) {
    let programme = getProgrammesByName(programmeName);

    for (let i = 0; i < addedProgrammes.length; i++) {
        if (addedProgrammes[i] === programme.id) {
            addedProgrammes.splice(i, 1);
        }
    }
}

function createComparisonSection(programID){

  let comparison = document.createElement("div");

// Kolla om det går att dra ut det på något sätt ur arrayn med id:n från addedProgrammes
let program = getProgrammesById(programID);
let programName = program.name;
let cityName = getCityFromUniID(program.universityID).name;
let countryName = getCountryFromUniID(program.universityID).name;

const titles = [ "Program", programName, cityName, countryName ];

  function createTable(comparisonKeys = ["Nivå", "Antagningspoäng", "Lärare - Omdöme", "Kurser - Omdöme", "Kursare - Omdöme", "Successrate"]) {
    let table = document.createElement("div");
    table.className = "table";

    comparisonKeys.forEach( key => {
    let category = document.createElement("div");
    category.className = "bold";
    category.textContent = key;

    // FUNKTION SOM LETAR FRAM VARJE VALUE TILL VARJE KEY

    let value = document.createElement("div");
    value.textContent = "VALUE FROM COMPARISONKEY";
    table.append(category, value);
    })

    return table;
  }

  function createTableList() {
    let table = document.createElement("div");
    table.className = "table--list";

    let value = document.createElement("div");
    value.textContent = "VALUE FROM COMPARISONKEY";
    table.append(value);

    return table;
  }

  function createSection(type, sectionTitle) {
    let section = document.createElement("section");
    let title = document.createElement("h3");
    title.className = "title-default";
    title.textContent = sectionTitle;
    let table =  type ? createTableList() : createTable();
    section.append(title, table);

    return section;
  }


  titles.forEach( title =>  comparison.append(createSection( titles.indexOf(title) == 1 ? true : false, title )));
  return comparison;
}