"use strict";

let programmes = [];

let programmIDs = JSON.parse(localStorage.favoriteProgrammes);
programmIDs.forEach( id => programmes.push(getProgrammesById(id)));

createProgrammeElements("favourites", programmes);

