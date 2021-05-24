"use strict";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pID = parseInt(urlParams.get("programmeID"));

// add to global?
function getProgrammeFromProgramID(programID){
    return DB.PROGRAMMES.find( program => programID === program.id );
}

//let pID = DB.PROGRAMMES[160].id; // Simulate extraction from URL 

const detailedProgram = getProgrammeFromProgramID(pID);
const detailedProgramUniversity = getUniversityFromUniID(detailedProgram.universityID);
const detailedProgramCity = getCityFromUniID(detailedProgram.universityID);
const detailedProgramCountry = getCountryFromUniID(detailedProgram.universityID)

let main = document.createElement("main");
main.append(makeHero(), makeProgrammeStats(), makeSchoolInfo(), makeCityInfo())
render("body", main)

registerCardHeight()


function makeHero(){
    let wrapper = document.createElement("section");
    wrapper.className = `detail-hero`;
    
    let header = document.createElement("header");
    let studyInfo = document.createElement("section");
    wrapper.append(header, studyInfo);

    let textWrapper = document.createElement("div");
    textWrapper.className = `title-wrapper`;

    let title = document.createElement("h1");
    title.textContent = detailedProgram.name;
    title.className = `title-large`;
    let subtitle =  document.createElement("span");
    subtitle.className = `text-default`;
    subtitle.textContent = detailedProgramUniversity.name;

    textWrapper.append(title, subtitle)
    header.append(cityImage(0), textWrapper);

    // studyInfo content
        const information = [
            //location
            [locationIcon, detailedProgramCity.name + ", " + detailedProgramCountry.name],
            //langauge
            [langIcon, DB.LANGUAGES.find( language => language.id === detailedProgram.language).name],
            // level
            [lvlIcon, DB.LEVELS[detailedProgram.level] ],
            // visa
            [visaIcon, detailedProgramCountry.visa === true ? "Kräver visum" : "Kräver inte visum"]
        ]

    information.forEach(info => {
        let container = document.createElement("div");

        let icon = document.createElement("i");
        icon.className = `icon`;
        icon.innerHTML = info[0];
        let text = document.createElement("span");
        text.textContent = info[1];
        text.className = `text-default`;
        container.append(icon, text);

        studyInfo.append(container);
    });

    
    return wrapper;
}

function makeProgrammeStats(){
    let wrapper = document.createElement("section");
    wrapper.className = `detail-stats detail-body`;

    const information = [
        ["Antagningspoäng", detailedProgram.entryGrades[0]],
        ["Avslutade Studier", detailedProgram.successRate[0] + "%"],
        ["Ortsboende Studenter", detailedProgram.localStudents],
        ["Utbytesstudenter", detailedProgram.exchangeStudents]
    ]

    information.forEach( info => {
        let container = document.createElement("div");
        container.className = `centered column`;
        let number = document.createElement("span");
        number.textContent = info[1];
        number.className = `text-large`;
        let text = document.createElement("span");
        text.textContent = info[0];
        container.append(number, text)

        wrapper.append(container);
    } )

    return wrapper
}

function makeSchoolInfo(){
    let wrapper = document.createElement("section");
    wrapper.className = `detail-school detail-body`;

    // outer divs
    let title = document.createElement("h2");
    title.textContent = "Om Utbildningen";
    title.className = `detail-title title-default`;
  
    let reviews = DB.COMMENTS_PROGRAMME.filter(comment => comment.programmeID === detailedProgram.id);
    let reviewWrapper = document.createElement("div");
    if (reviews.length > 0){
        reviewWrapper.append(cardCarousell(reviews, "rev"))
    }

    let schoolInfo = document.createElement("section");
    schoolInfo.className = `detail-school-sections`;
    schoolInfo.append(createClubSection());


    wrapper.append(title, reviewWrapper, schoolInfo)
    
    let otherUniversities = DB.PROGRAMMES.filter( program => program.name === detailedProgram.name)
    if (otherUniversities.length > 1){
        schoolInfo.append(createOtherSchoolsSection(otherUniversities))
    }
    
    return wrapper
}

function createClubSection(){
    let wrapper = document.createElement("section");

    let title = document.createElement("h3");
    title.className = `detail-sub title-small`;
    title.textContent = `Engagera dig i skolans klubbar`;
    wrapper.append(title)

    let schoolClubs = DB.CLUBS.filter( club => club.universityID === detailedProgram.universityID);

    schoolClubs.forEach( club => {
        let container = document.createElement("div");
        let name = document.createElement("div");
        name.textContent = club.name ? 
        club.name : 
        `Skolklubben för ${getUniversityFromUniID(club.universityID).name}`;
        
        let members = document.createElement("span");
        members.className = `italic`;
        members.textContent = `${club.memberCount} medlemmar`;

        container.append(name, members)
        wrapper.append(container)

    })

    return wrapper
}

function createOtherSchoolsSection(uniArray){
    let wrapper = document.createElement("section");

    let title = document.createElement("h3");
    title.className = `detail-sub title-small`;
    title.textContent = `Studera ${detailedProgram.name} vid andra universitet `;
    wrapper.append(title)

    uniArray.forEach(program => {
        let uni = document.createElement("div");
        uni.textContent = getUniversityFromUniID(program.universityID).name;
        wrapper.append(uni)
    })

    return wrapper
}

function createReviewCard(reviewObject){
    let wrapper = document.createElement("article");
    wrapper.className = `card`;

    let review = document.createElement("section");
    review.className = `card-review`;
    let ratings = document.createElement("section");
    ratings.className = `card-rating`;

    wrapper.append(review, ratings);

    // review content
    let deco = document.createElement("span");
    deco.textContent = `"`;
    deco.className = `card-deco text-large`;
    let comment = document.createElement("p");
    comment.textContent = reviewObject.text;
    let whoWhen = document.createElement("div");
    whoWhen.className = "card-alias";
    review.append(deco, comment, whoWhen);

    let name = document.createElement("span");
    name.textContent = `— ${reviewObject.alias}`;
    let date = document.createElement("span");
    date.textContent = `${reviewObject.date.year}-${reviewObject.date.month}-${reviewObject.date.day}`
    whoWhen.append(name, date);

    // rating content
    let categories = reviewObject.stars.out ?
    ["Uteliv", "Mat", "Boende"] :
    ["Lärare", "Studenter", "Kurser"];

    for (let i = 0; i < categories.length; i++) {
        let container = document.createElement("div");

        let star = document.createElement("span");
        star.className = `text-large`;
        star.textContent = `${Object.values(reviewObject.stars)[i]} / 5`;
        let category = document.createElement("span");
        category.className = `light`;
        category.textContent = categories[i];

        container.append(star, category);
        ratings.append(container)      
    }

    return wrapper
}

function makeCityInfo(){
    let wrapper = document.createElement("section");
    wrapper.className = `detail-city detail-body`;

    let head = document.createElement("div");
    head.className = `intro`;
    
    // head child
    let titleWrap = document.createElement("div");
    let paragraph = document.createElement("p");
    paragraph.textContent = detailedProgramCity.text;
    head.append(titleWrap, paragraph)

    let title = document.createElement("h2");
    title.className = `detail-title title-default`;    
    title.textContent = `Om ${detailedProgramCity.name}`;
    titleWrap.append(cityImage(1), title)   
    
    let reviews = DB.COMMENTS_CITY.filter(comment => comment.cityID === detailedProgramCity.id)
    let reviewWrapper = document.createElement("div");
    if(reviews.length > 0){
        reviewWrapper.append(cardCarousell(reviews, "rev"))
    }
    //also review cards
    wrapper.append(head, reviewWrapper, makeWeatherInfo())

    return wrapper

}

function cityImage(x){
    let cityImage = document.createElement("div");
    cityImage.style.backgroundImage = `url( assets/Images/${detailedProgramCity.imagesBig[x]} )`;
    cityImage.className = `bg-image`;

    return cityImage
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
    figcaption.className = `text-default italic`;
    if ( programCities.length === 1){
        figcaption.textContent = `${detailedProgramCity.name} är den enda staden där du kan studera ${detailedProgram.name}`;
    } else {
        figcaption.textContent = `Såhär jämför sig soldagarna i ${detailedProgramCity.name} med alla städer där du också kan studera ${detailedProgram.name}`;
    }
    let diagram = document.createElement("div");
    figure.append(figcaption, diagram)

    programCities.forEach(city => {
        let wrapper = document.createElement("div");
        wrapper.className = `detail-weather-city`;
        diagram.append(wrapper);

        let cityName = document.createElement("span");
        cityName.textContent = city.name;

        let barWrapper = document.createElement("div");
        barWrapper.className = `detail-weather-bar`;

        let bar = document.createElement("div");
        bar.style.width = `${(city.sun / 365) * 100}%`;

        let sunNum = document.createElement("span");
        sunNum.textContent = `${city.sun}`;
        bar.append(sunNum);
        barWrapper.append(bar)

        wrapper.append(cityName, barWrapper)
    })  


    return figure
}

function makeWeatherInfo(){
    let wrapper = document.createElement("section");


    let title = document.createElement("h3");
    title.className = `detail-sub title-small`;
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

