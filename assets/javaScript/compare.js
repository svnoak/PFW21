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

  let currentPrograms = document.createElement("div");
  currentPrograms.className = "pills";

  searchBar.addEventListener("keyup", () => {
    let searchInput = searchBar.value.toLowerCase();

    if (document.querySelector(".datalist")) {
      document.querySelector(".datalist").remove();
    }

    let dataList = document.createElement("div");
    dataList.className = "datalist";
    searchBar.after(dataList);

    getProgrammesBySearchWord(searchInput).forEach((program) => {
      let option = document.createElement("div");
      option.className = "option";
      option.textContent = program.name;
      dataList.append(option);

      option.addEventListener("click", () => {
        addProgramToList(program.id);
        createPillForSearchWords(program.name, ".pills");
      });
    });
  });

  header.append(titleHeader, textHeader, searchBar, currentPrograms);

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

function addProgramToList(programID) {
  if (addedProgrammes.includes(programID)) {
    return;
  } else {
    addedProgrammes.push(programID);
  }
  console.log(addedProgrammes);
}
