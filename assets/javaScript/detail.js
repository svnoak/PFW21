"use strict";
// add to global?
function getProgrammeFromProgramID(programID){
    return DB.PROGRAMMES.find( program => programID === program.id );
}

let pID = DB.PROGRAMMES[0].id; // Simulate extraction from URL 

const detailedProgram = getProgrammeFromProgramID(pID);
const detailedProgramUniversity = getUniversityFromUniID(detailedProgram.universityID);
const detailedProgramCity = getCityFromUniID(detailedProgram.universityID);
const detailedProgramCountry = getCountryFromUniID(detailedProgram.universityID)

function makeHero(){
    let wrapper = document.createElement("section");
    wrapper.className = ``;
    
    let header = document.createElement("header");
    header.className = ` `;
    let studyInfo = document.createElement("section");
    studyInfo.className = ``;
    wrapper.append(header, studyInfo);

    //header content
    let title = document.createElement("h1");
    title.textContent = detailedProgram.name;
    let subtitle =  document.createElement("span");
    subtitle.textContent = detailedProgramUniversity.name;
    header.append(title, subtitle);

    // studyInfo content
        const information = [
            //location
            [pinIcon, detailedProgramCity.name + ", " + detailedProgramCountry.name],
            //langauge
            [bookIcon, DB.LANGUAGES.find( language => language.id === detailedProgram.language).name],
            // level
            [bookOpenIcon, DB.LEVELS[detailedProgram.level] ],
            // visa
            [alertIcon, detailedProgramCountry.visa === true ? "Kräver visum" : "Kräver inte visum"]
        ]

    information.forEach(info => {
        let container = document.createElement("div");

        let icon = document.createElement("i");
        icon.innerHTML = info[0];
        let text = document.createElement("span");
        text.textContent = info[1];
        wrapper.append(icon, text);

        studyInfo.append(container);
    });

    
    return wrapper;
}

function makeProgrammeStats(){
    let wrapper = document.createElement("section");
    wrapper.className = ``;

    const information = [
        ["Antagningspoäng", detailedProgram.entryGrades[0]],
        ["Avslutade Studier", detailedProgram.successRate[0] + "%"],
        ["Ortsboende Studenter", detailedProgram.localStudents],
        ["Utbytesstudenter", detailedProgram.exchangeStudents]
    ]

    information.forEach( info => {
        let container = document.createElement("div");
        let number = document.createElement("span");
        number.textContent = info[1];
        let text = document.createElement("span");
        text.textContent = info[0];
        container.append(number, text)

        wrapper.append(container);
    } )

    return wrapper
}

document.body.prepend( makeProgrammeStats() );
document.body.prepend(makeHero());

// render( "body", makeHero() );
