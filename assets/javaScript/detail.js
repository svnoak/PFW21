"use strict";
// add to global?
function getProgrammeFromProgramID(programID){
    return DB.PROGRAMMES.find( program => programID === program.id );
}

let pID = DB.PROGRAMMES[0].id; // Simulate extraction from URL 

const detailedProgram = getProgrammeFromProgramID(pID);
const detailedProgramUniversity = getUniversityFromUniID(detailedProgram.universityID);

function makeHero(){
    let wrapper = document.createElement("section");
    wrapper.className = ``;
    
    let header = document.createElement("header");
    header.className = ` `;
    let studyInfo = document.createElement("section");
    studyInfo.className = ``;
    wrapper.append(header, studyInfo);

    let title = document.createElement("h1");
    title.textContent = detailedProgram.name;
    let subtitle =  document.createElement("span");
    subtitle.textContent = detailedProgramUniversity.name;
    header.append(title, subtitle);
    
    return wrapper;
}

console.log( typeof makeHero() )

render( "body", makeHero() );