"use strict";

let addedProgrammes = [];
let programmeIDs = JSON.parse(localStorage.favoriteProgrammes);
let programmes = [];
programmeIDs.forEach( id => programmes.push(getProgrammesById(id)));

let favorites = programmes.map( programme => {
  let university = getUniversityFromUniID(programme.universityID);

  return {
    programme: programme.name,
    university: university.name,
    id: programme.id
  }
});

render("body", createHeader(), createNav(), tableContainer());
let main = document.getElementById("comparison");

document.querySelectorAll(".switch").forEach( arrow => arrow.addEventListener("click", function () {switchProgram(this.id)}) );

//Skapar header med sökruta
function createHeader() {
  let header = document.createElement("div");
  header.className = "compare-header centered column";

  let titleHeader = document.createElement("h1");
  titleHeader.className = 'title-default regular';
  titleHeader.textContent = "Jämför program";

  let textHeader = document.createElement("p");
  textHeader.className = 'text-default light'
  textHeader.textContent = "Här kan du jämföra dina favoriter och bestämma vilket program som är rätt för just dig!";

  let searchWrapper = document.createElement('div');
  searchWrapper.className = 'search-wrapper';

  let searchBar = document.createElement("input");
  searchBar.className = 'search-bar text-default';
  searchBar.type = "list";
  searchBar.placeholder = "Lägg till program att jämföra";

  let searchBarIcon = document.createElement('i');
  searchBarIcon.className = 'centered';
  searchBarIcon.innerHTML = searchIcon;

  let currentProgrammesTitle = document.createElement('p');
  currentProgrammesTitle.className = 'text-default light';
  currentProgrammesTitle.textContent = 'Dessa program jämförs just nu:';
  let currentProgrammes = document.createElement("div");
  currentProgrammes.id = "search-words-pills";

  let programmeList = document.createElement("div");
  programmeList.className = "programme-list";
  programmeList.style.maxHeight = "0px";

  let closeProgrammeList = document.createElement('i');
  closeProgrammeList.className = 'close-list';
  closeProgrammeList.innerHTML = closeIcon;
  closeProgrammeList.addEventListener('click', () => {
    programmeList.style.maxHeight = "0px";
    setTimeout( () => {
      programmeList.remove();
    }, 400);
  })

  let favoritesContainer = document.createElement('div');
  favoritesContainer.className = 'favorites';

  let titleFavorites = document.createElement('div');
  titleFavorites.className = 'title-favorites text-large bold';
  titleFavorites.textContent = 'Favoriter';
  favoritesContainer.append(titleFavorites);

  favorites.forEach(favorite => { 
    let option = createOptionsInList(favorite.programme, favorite.university);
    titleFavorites.after(option);

    option.addEventListener('click', () => {
      addProgrammeToArray(favorite.id);
      option.classList.toggle('chosen');
    });
  });

  let searchResult = document.createElement('div');
  searchResult.className = 'search-result';
    
  programmeList.append(closeProgrammeList, favoritesContainer, searchResult);

  searchBar.addEventListener('click', () => {
    searchWrapper.append(programmeList);
    setTimeout( () => {
      programmeList.style.maxHeight = "50vh";
    }, 10);
  });

  searchBar.addEventListener("keyup", () => {    
    document.querySelector('.search-result').innerHTML = '';
    
    if(searchBar.value.length > 0) {
      favoritesContainer.remove();
      let programmes = getSuggestionsBySearchWord(searchBar.value);

      programmes.forEach(programme => {
        let university = getUniversityFromUniID(programme.universityID);
        let option = createOptionsInList(programme.name, university.name);

        if(addedProgrammes.includes(programme.id)) {
          option.classList.add('chosen');
        }
  
        option.addEventListener('click', () => {
          option.classList.toggle('chosen');
          addProgrammeToArray(programme.id);
        });
  
        searchResult.append(option);
      });
    } else {
      programmeList.append(favoritesContainer);
    }

  });

  searchWrapper.append(searchBar, searchBarIcon);
  header.append(titleHeader, textHeader, searchWrapper, currentProgrammesTitle, currentProgrammes);

  return header;
}

//Creates the nav with the name and arrows of each program
function createNav(index = 0) {
  let navBtn = document.createElement("div");
  navBtn.id = "menu";
  navBtn.className = "scroll-left title-xsmall regular space-between";

  let program = document.createElement("span");
  program.id = index;
  addedProgrammes.length ?
  program.textContent = getProgrammesById(addedProgrammes[index]).name :
  program.textContent = "Program";

  let iconLeft = document.createElement("i");
  iconLeft.innerHTML = trailingIconLeft;
  iconLeft.className = "switch";
  iconLeft.id = "prev";

  let iconRight = document.createElement("i");
  iconRight.innerHTML = trailingIconRight;
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
  main = document.getElementById("comparison");
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

// Tar fram de program som matchar med sökorden
function getSuggestionsBySearchWord(searchWord) {
  let programmes = DB.PROGRAMMES.filter((obj) => {
    let name = obj.name.toLowerCase();
    return name.includes(searchWord.toLowerCase());
  });

  programmes.sort( (obj1, obj2) => obj1.name < obj2.name ? -1 : 1 );

  return programmes;
}

// Skapar sökalternativen i programlistan
function createOptionsInList(programmeName, universityName) {
  let option = document.createElement("div");
  option.className = "option space-between";
  
  let programmeInfo = document.createElement('div');
  
  let programme = document.createElement('p');
  programme.className = 'text-default';
  programme.textContent = programmeName;
  
  let university = document.createElement('p');
  university.className = 'text-small';
  university.textContent = universityName;
  
  let addProgramme = document.createElement('i');
  addProgramme.innerHTML = plusIcon;
  
  programmeInfo.append(programme, university);
  option.append(programmeInfo, addProgramme);
  
  return option;
}

// Lägger till valda program-id i en array
function addProgrammeToArray(programmeId) {
  if (addedProgrammes.includes(programmeId)) {
    removePillFromArray(programmeId);
  } else {
    addedProgrammes.push(programmeId);
  }

  document.querySelector('#search-words-pills').innerHTML = '';

  addedProgrammes.forEach( id => {
    render('#search-words-pills', createPillFromProgrammeId(id));
    updateComparison();  
  });
}

// Skapar pillrerna med sökorden
function createPillFromProgrammeId(id) {
    let programmeName = getProgrammesById(id).name;

    let pill = document.createElement("div");
    pill.className = "pill";
  
    let pillSearchWord = document.createElement("p");
    pillSearchWord.className = "pill-search-word text-small";
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

// Tar bort pillrerna
function removePillFromArray(programmeId) {

    for (let i = 0; i < addedProgrammes.length; i++) {
        if (addedProgrammes[i] === programmeId) {
            addedProgrammes.splice(i, 1);
        }
    }
    updateComparison();
}

function updateComparison() {
  let comparison = document.querySelector("#comparison--container");
  if(comparison) { comparison.innerHTML = ""; }

  render("#comparison--container", createAllSections(addedProgrammes));
  
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
      category.className = "text-default semi-bold";
      category.textContent = key;

      let value = document.createElement("div");
      value.className = "text-default regular";
      value.textContent = getValue(key);
      table.append(category, value);
    });

    return table;
  }

  function createTableList(comparisonKey) {
    let table = document.createElement("div");
    table.className = "table--list";

    let category = document.createElement("div");
    category.className = "text-default semi-bold";
    category.textContent = comparisonKey[0];
    table.append(category);

    getValue(comparisonKey[0]).forEach( club => {
      let value = document.createElement("div");
      value.className = "text-default regular";
      club.name ? value.textContent = club.name : value.textContent = "Club of the nameless";
      table.append(value);
      })

    return table;
  }

  function createSection(type, sectionTitle, index) {
    let section = document.createElement("section");
    let title = document.createElement("h3");
    title.className = " table-title title-xsmall regular";
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

function tableContainer() {
  let section = document.createElement("main");
  section.id = "comparison--container";

  let inner = document.createElement("div");
  inner.id = "comparison";

  section.append(inner);
  
  return section;
}


function createAllSections(programmes) {
  let inner = document.createElement("div");
  inner.id = "comparison";

  if (addedProgrammes.length > 0) {
    programmes.forEach( programID => {
      inner.append(createComparisonSection(programID));
    });
  }
  render("#comparison--container", inner);
  return inner;
  
}

function getClubsByProgramID(programID) {
  let clubs = CLUBS.filter( club => club.universityID == getProgrammesById(programID).universityID );
  return clubs;
}