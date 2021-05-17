"use strict";

render('body', createBackground(), createHero(), createBrandInfo(), createAdSpace(), cardCarousell(DB.COUNTRIES));

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
    textHero.className = 'text-small semi-bold';
    textHero.textContent = 'Här kan du hitta spännande program över hela världen. Vi hjälper dig att hitta rätt!';

    let buttonHero = document.createElement('a');
    buttonHero.href = 'search.html';
    buttonHero.className = 'text-default semi-bold';
    buttonHero.textContent = 'Sök efter program';

    let pin = document.createElement('div');
    pin.classList = 'pin-header';
    pin.innerHTML = headerPin;


    indexHero.append(pin, titleHero, globeRender, textHero, buttonHero);
    
    return indexHero;
}

function createBrandInfo() {
    let brandInfo = document.createElement('div');
    brandInfo.className = 'brand-info';

    let title = document.createElement('h2');
    title.className = 'title-default regular';
    title.textContent = 'VILKA ÄR [BRAND]?';

    let text = document.createElement('p');
    text.className = 'text-small';
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
    let wrapper = document.createElement('div');
    wrapper.className = 'countryElement';

    let header = document.createElement('div');
    header.className = 'country-info';

    let countryName = document.createElement('h3');
    countryName.className = 'title-default';
    countryName.textContent = country.name;

    let countryInfo = document.createElement('p');
    countryInfo.className = 'text-small';
    countryInfo.textContent = country.text;
    countryInfo.innerHTML = `${countryInfo.innerHTML.substring(0,70)}...`; // Begränsar texten till 70 tecken
    header.append(countryName, countryInfo);

    let countryImg = document.createElement('div');
    countryImg.style.backgroundImage = `url(assets/images/${country.imagesNormal[1]})`;
    countryImg.className = 'country-img';

    let showProgramsButton = document.createElement('a');
    showProgramsButton.className = 'text-small'
    showProgramsButton.textContent = 'Visa program';
    showProgramsButton.href = 'search.html';
    showProgramsButton.addEventListener('click', () => {
        sessionStorage.setItem('countryId', country.id);
    });
    countryImg.append(showProgramsButton);
    
    
    wrapper.append(header, countryImg); 
    
    return countryElement;
    return wrapper;
}
}