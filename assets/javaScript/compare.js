"use strict";

let addedProgrammes = [1,2,3,4];

render("body", createHeader(), createNav(), createComparisonSection(28));

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

function createNav() {
  let nav = document.createElement("span");
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

  let program = getProgrammesById(programID);
  let programName = program.name;
  let cityName = getCityFromUniID(program.universityID).name;
  let countryName = getCountryFromUniID(program.universityID).name;

  const titles = [ "Program", programName, cityName, countryName ];
  const comparisonKeys = 
    [
    ["Nivå", "Antagningspoäng", "Lärare - Omdöme", "Kurser - Omdöme", "Kursare - Omdöme", "Successrate"],
    ["Mat - Omdöme", "Uteliv - Omdöme", "Boende - Omdöme", "Soldagar / år"],
    ["Klubb"],
    ["Språk som talas", "Visum"]
    ];

  function createTable(comparisonKey) {
    let table = document.createElement("div");
    table.className = "table";

    comparisonKey.forEach( key => {
      let category = document.createElement("div");
      category.className = "bold";
      category.textContent = key;

      let value = document.createElement("div");
      value.textContent = getValue(key);
      table.append(category, value);
    });

    return table;
  }

  function createTableList(comparisonKey) {
    let table = document.createElement("div");
    table.className = "table--list";

    let category = document.createElement("div");
    category.className = "bold";
    category.textContent = comparisonKey[0];
    table.append(category);

    getValue(comparisonKey[0]).forEach( club => {
      let value = document.createElement("div");
      club.name ? value.textContent = club.name : value.textContent = "Club of the nameless";
      table.append(value);
      })

    return table;
  }

  function createSection(type, sectionTitle, index) {
    let section = document.createElement("section");
    let title = document.createElement("h3");
    title.className = "title-default";
    title.textContent = sectionTitle;
    section.append(title);
    type ?
    section.append(createTableList(comparisonKeys[index])) : 
    section.append(createTable(comparisonKeys[index]));

    return section;
  }

  function getValue(key) {
    let value;
    switch (key) {
      case "Nivå":
        value = getLevel(program.level);
        break;
      
      case "Antagningspoäng":
        value = program.entryGrades[0];
        break;
    
      case "Lärare - Omdöme":
        value = "Omdöme placeholder";
        break;

      case "Kurser - Omdöme":
        value = "Omdöme placeholder";
        break;

      case "Kursare - Omdöme":
        value = "Omdöme placeholder";
        break;

      case "Successrate":
        value = program.successRate[0];
        break;

      case "Mat - Omdöme":
        value = "Omdöme placeholder";
        break;

      case "Uteliv - Omdöme":
        value = "Omdöme placeholder";
        break;

      case "Boende - Omdöme":
        value = "Omdöme placeholder";
        break;
      
      case "Soldagar / år":
        value = getCityFromUniID(program.universityID).sun;
        break;
      
      case "Språk som talas":
      value = getLanguageFromUniID(program.universityID);
      break;

      case "Visum":
      value = getCountryFromUniID(program.universityID).visa ? "Krävs" : "Krävs inte";
      break;

      case "Klubb":
      value = getClubsByProgramID(programID);
      break;

      default:
        break;
    }
    return value;
  }


  titles.forEach( title => comparison.append(createSection( titles.indexOf(title) == 2 ? true : false, title, titles.indexOf(title) )));
  return comparison;
}

function getClubsByProgramID(programID) {
  let clubs = CLUBS.filter( club => club.universityID == getProgrammesById(programID).universityID );
  return clubs;
}