"use strict";
// add to global?
function getProgrammeFromProgramID(programID){
    return DB.PROGRAMMES.find( program => programID === program.id );
}

let pID = DB.PROGRAMMES[4].id; // Simulate extraction from URL 

const detailedProgram = getProgrammeFromProgramID(pID);
const detailedProgramUniversity = getUniversityFromUniID(detailedProgram.universityID);
const detailedProgramCity = getCityFromUniID(detailedProgram.universityID);
const detailedProgramCountry = getCountryFromUniID(detailedProgram.universityID)

function makeHero(){
    let wrapper = document.createElement("section");
    wrapper.className = ``;
    
    // css: position: relative!!!
    let header = document.createElement("header");
    header.className = ` `;
    header.style.position = "relative"; // to position image absolute

    let studyInfo = document.createElement("section");
    studyInfo.className = ``;
    wrapper.append(header, studyInfo);

    //header content, css color: white;
    let title = document.createElement("h1");
    title.textContent = detailedProgram.name;
    let subtitle =  document.createElement("span");
    subtitle.textContent = detailedProgramUniversity.name;

    let cityImage = document.createElement("div");
    cityImage.style.backgroundImage = `url( assets/Images/${detailedProgramCity.imagesBig[0]} )`;
    cityImage.className = ``;
    cityImage.style.position = "absolute";  // lägga in dessa 
    cityImage.style.width= "100%";          //
    cityImage.style.height= "100%";         //
    cityImage.style.zIndex= "-1";           // i css?

    header.append(cityImage, title, subtitle);

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

function makeWeatherInfo(){
    let wrapper = document.createElement("section");
    wrapper.className = ``;

    let title = document.createElement("h3");
    title.textContent = "Väder";

    let paragraph = document.createElement("p");
    let weather;
    if(detailedProgramCity.sun < 180){
        weather = "molnigt"; 
    } else if (detailedProgramCity.sun < 220){
        weather = "växlande moligt";
    } else if( detailedProgramCity.sun < 280){
        weather = "växlande soligt";
    } else if (detailedProgramCity.sun < 320){
        weather = "soligt"
    } else {
        weather = "väldigt soligt"
    }
    paragraph.textContent = `I ${detailedProgramCity.name} är det ${weather}.`;


    wrapper.append(title, paragraph, createDiagram())

    return wrapper
}

function createDiagram() {
    // find all programs with same name
    let allSameProgram = DB.PROGRAMMES.filter( program => program.name === detailedProgram.name);

    // create unique array of the cities
    let programCities = [...new Set( allSameProgram.map( program => getCityFromUniID(program.universityID).name) )]

    //create simplified array
    programCities = programCities.map( programCity =>{
        let cityObject = DB.CITIES.find( city => city.name === programCity)
  
        return {
            name: cityObject.name,
            country: DB.COUNTRIES.find( country => country.id === cityObject.countryID).name,
            sun: cityObject.sun,
            programName: detailedProgram.name
        }
    } )

    //DOM Figure
    let figure = document.createElement("figure");

    let figcaption = document.createElement("figcaption");
    if ( programCities.length === 1){
        figcaption.textContent = `${detailedProgramCity.name} är den enda staden där du kan studera ${detailedProgram.name}`;
    } else {
        figcaption.textContent = `Såhär jämför sig vädret i ${detailedProgramCity.name} med alla städer där du också kan studera ${detailedProgram.name}`;
    }
    let diagram = document.createElement("div");
    figure.append(figcaption, diagram)

    programCities.forEach(city => {
        let wrapper = document.createElement("div");
        diagram.append(wrapper);

        let cityName = document.createElement("span");
        cityName.textContent = city.name;

        let bar = document.createElement("div");
        bar.style.width = `${city.sun / 356}%`;

        let sunNum = document.createElement("span");
        sunNum.textContent = `${city.sun} soldagar`;
        bar.append(sunNum);

        wrapper.append(cityName, bar)
    })  


    return figure
}

function makeCityInfo(){

}

document.body.prepend( makeProgrammeStats() );
document.body.prepend(makeWeatherInfo());
document.body.prepend(makeHero());


// render( "body", makeHero() );
