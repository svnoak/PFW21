"use strict";

render('body', createHero(), createBrandInfo(), createAdSpace(), cardCarousell(DB.COUNTRIES));

// Skapar HERO med innehåll
function createHero() {
    let indexHero = document.createElement('div');
    indexHero.className = 'hero';

    let titleHero = document.createElement('h1');
    titleHero.className = 'title-hero';
    titleHero.textContent = 'Upptäck världen som student.'

    let globeRender = document.createElement('div');
    globeRender.className = 'globe-render';

    let textHero = document.createElement('p');
    textHero.className = 'text-default bold';
    textHero.textContent = 'Här kan du hitta spännande program över hela världen. Vi hjälper dig att hitta rätt!';

    let buttonHero = document.createElement('a');
    buttonHero.href = 'search.html';
    buttonHero.className = 'button-large button-round button-cta';
    buttonHero.textContent = 'Sök efter program';

    indexHero.append(titleHero, globeRender, textHero, buttonHero);
    
    return indexHero;
}

function createBrandInfo() {
    let brandInfo = document.createElement('div');
    brandInfo.className = 'brand-info';

    let title = document.createElement('h2');
    title.className = 'title-default';
    title.textContent = 'VILKA ÄR [BRAND]?';

    let text = document.createElement('p');
    text.className = 'text-default';
    text.textContent = '[Brand] erbjuder en lättanvänd sökmotor för dig som vill eller funderar på att studera utomlands. Filtrera utefter dina behov och jämför dina favoriter.';

    brandInfo.append(title, text);
    return brandInfo;
}

function createAdSpace() {
    let adSpace = document.createElement('div');
    adSpace.className = 'ad-space';

    return adSpace;
}

// Skapar DOM-element för alla länder
function createCard(country) {
    let countryElement = document.createElement('div');
    countryElement.className = 'countryElement';

    let countryName = document.createElement('h3');
    countryName.className = 'title-default';
    countryName.textContent = country.name;

    let countryInfo = document.createElement('p');
    countryInfo.className = 'text-small';
    countryInfo.textContent = country.text;
    countryInfo.innerHTML = `${countryInfo.innerHTML.substring(0,70)}...`; // Begränsar texten till 70 tecken

    let countryImg = document.createElement('div');
    countryImg.style.backgroundImage = `url(assets/images/${country.imagesNormal[1]})`;

    let showProgramsButton = document.createElement('a');
    showProgramsButton.className = 'button-large button-square text-small'
    showProgramsButton.textContent = 'Visa program';
    showProgramsButton.href = 'search.html';
    showProgramsButton.addEventListener('click', () => {
        sessionStorage.setItem('countryId', country.id);
    });
    countryImg.append(showProgramsButton);
    
    
    countryElement.append(countryName, countryInfo, countryImg); 
    
    return countryElement;
}