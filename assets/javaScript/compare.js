"use strict";

let addedProgrammes = [];

render("body", createHeader(), createNav(), createAllSections(addedProgrammes));
document.querySelectorAll(".switch").forEach( arrow => arrow.addEventListener("click", function () {switchProgram(this.id)}) );
let main = document.querySelector("#comparison");

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

//Creates the nav with the name and arrows of each program
function createNav(index = 0) {
  let navBtn = document.createElement("div");
  navBtn.id = "menu";

  let program = document.createElement("span");
  program.id = index;
  addedProgrammes.length ?
  program.textContent = getProgrammesById(addedProgrammes[index]).name :
  program.textContent = "Program";

  let iconLeft = document.createElement("i");
  iconLeft.textContent = "< ";
  iconLeft.className = "switch";
  iconLeft.id = "prev";

  let iconRight = document.createElement("i");
  iconRight.textContent = " >";
  iconRight.className = "switch";
  iconRight.id = "next";

  navBtn.append(iconLeft, program, iconRight);
  return navBtn;
};


//Changes the name of the nav depending on what action is taken
function changeNavName(trigger){
  let index = 0;
  let programNameContainer = document.querySelector("#menu > span");
  if(addedProgrammes.length > 0) {
    addedProgrammes.forEach( id => {
      getProgrammesById(id).name == programNameContainer.textContent ? index = addedProgrammes.indexOf(id) : index;
    });
    switch (trigger) {
      case "next":
        index = index + 1;
        if (index >= addedProgrammes.length) index = 0;
        break;

      case "prev":
        index = index - 1;
        if (index < 0) index = setIndex("prev", index);
        break;

      case "target":
        index = setIndex("target", index);
        break;
    
      case "default":
        index = 0;
        break;
    }

    programNameContainer.textContent = getProgrammesById(addedProgrammes[index]).name;
    programNameContainer.id = index;
  }
  else { programNameContainer.textContent = "Program" };
}

function setIndex(key, index) {
  switch (key) {
    case "reset":
      index = 0;
      break;

    case "prev":
      index = index -1;
      index < 0 ? index = addedProgrammes.length-1 : index;
      break;

    case "next":
      index >= addedProgrammes.length ? index = 0 : index;
      break;

    case "target":
      main.style.left ? index = parseInt(main.style.left.split("vw")[0])/-100 : index = index;
      if (index >= addedProgrammes.length) index = addedProgrammes.length-1;
      break;
  }
  return index;
}

function switchProgram(id) {
  if (addedProgrammes.length) {
    changeNavName(id);
    if(addedProgrammes.length > 1) {
      let min = addedProgrammes.length-1;
      if (id == "next") {
        min == 0 ? min = "0vw" : min = parseInt(`-${min}00`);
        if (main.style.left.split("vw")[0] == min) {
          main.style.left = "0vw";
        }
          else {
            main.style.left = `${main.style.left.split("vw")[0]-100}vw`;
          }
      }
      else {
        if (main.style.left.split("vw")[0] == 0) {
          main.style.left = `-${addedProgrammes.length-1}00vw`;
        }
          else {
            main.style.left = parseInt(main.style.left.split("vw")[0]) + 100 + "vw";
          }
      }
    }
  }
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
    updateComparison();
  });
}

function removePillFromArray(programmeName) {
    let programme = getProgrammesByName(programmeName);

    for (let i = 0; i < addedProgrammes.length; i++) {
        if (addedProgrammes[i] === programme.id) {
            addedProgrammes.splice(i, 1);
        }
    }
    updateComparison();

}

function updateComparison() {
  main.innerHTML = "";
  render("main", createAllSections(addedProgrammes));
  addedProgrammes.length == 0 ? changeNavName("default") : changeNavName("target");
  if ( main.style.left.split("vw")[0] < parseInt(`-${addedProgrammes.length-1}00`) ) {
    main.style.left = `-${addedProgrammes.length-1}00vw`;
  }
}

function createComparisonSection(programID){

  let comparison = document.createElement("div");
  comparison.id = programID;
  comparison.className = "program-list"

  let program = getProgrammesById(programID);
  let programName = program.name;
  let uniName = getUniversityFromUniID(program.universityID).name;
  let cityName = getCityFromUniID(program.universityID).name;
  let countryName = getCountryFromUniID(program.universityID).name;

  const titles = [ programName, cityName, uniName, countryName ];
  const comparisonKeys = 
    [
    ["Nivå", "Antagningspoäng", "Lärare - Omdöme", "Kurser - Omdöme", "Kursare - Omdöme", "Successrate"],
    ["Mat - Omdöme", "Uteliv - Omdöme", "Boende - Omdöme", "Soldagar / år"],
    ["Klubbar"],
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

  function getMedianReview(database, id, key){
    let comments;
    let databaseKey;
    database === "program" ? databaseKey = "programmeID" : databaseKey = "cityID";
    database === "program" ? id = id : id = getCityFromUniID(getProgrammesById(id).universityID).id;
    comments = database == "program" ? database = COMMENTS_PROGRAMME : database = COMMENTS_CITY;
    let reviews = comments.filter( comment => comment[databaseKey] == id );
    reviews = reviews.map( review => review.stars[key]);
    let sum;
    if (reviews.length > 0) sum = reviews.reduce((a,b) => a + b );
    let median = sum / reviews.length;
    return median.toFixed(1);
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
        value = `${getMedianReview("program", programID, "teachers")} / 5`;
        break;

      case "Kurser - Omdöme":
        value = `${getMedianReview("program", programID, "courses")} / 5`;
        break;

      case "Kursare - Omdöme":
        value = `${getMedianReview("program", programID, "students")} / 5`;
        break;

      case "Successrate":
        value = program.successRate[0];
        break;

      case "Mat - Omdöme":
        value = `${getMedianReview("city", "", "food")} / 5`;
        break;

      case "Uteliv - Omdöme":
        value = `${getMedianReview("city", "", "out")} / 5`;
        break;

      case "Boende - Omdöme":
        value = `${getMedianReview("city", "", "accomodation")} / 5`;
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

      case "Klubbar":
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

function createAllSections(programmes) {
  let section = document.createElement("main");
  section.id = "comparison";
  if (addedProgrammes.length > 0) {
    programmes.forEach( programID => {
      section.append(createComparisonSection(programID));
    });
  }
  return section;
  
}

function getClubsByProgramID(programID) {
  let clubs = CLUBS.filter( club => club.universityID == getProgrammesById(programID).universityID );
  return clubs;
}