"use strict";

render('body', createBackground());
render('.wrapper', createHero(), createBrandInfo(), createAdSpace(), cardCarousell(DB.COUNTRIES), createCompareInfo());

// Skapar HERO med innehåll
function createHero() {
    let indexHero = document.createElement('div');
    indexHero.className = 'hero centered';

    let titleHero = document.createElement('h1');
    titleHero.className = 'title-hero';
    titleHero.textContent = 'Upptäck världen som student.'

    let globeRender = document.createElement('div');
    globeRender.className = 'globe-render';

    let textHero = document.createElement('p');
    textHero.className = 'text-default semi-bold';
    textHero.textContent = 'Här kan du hitta spännande program över hela världen. Vi hjälper dig att hitta rätt!';

    let buttonHero = document.createElement('a');
    buttonHero.href = 'search.html';
    buttonHero.className = 'text-large semi-bold space-between button-round button-cta';
    buttonHero.innerHTML = `<i id="white-icon">${searchIcon}</i> Sök efter program`;

    let pin = document.createElement('div');
    pin.classList = 'pin-header';
    pin.innerHTML = headerPin;


    indexHero.append(pin, titleHero, globeRender, textHero, buttonHero);
    
    return indexHero;
}

function createBrandInfo() {
    let brandInfo = document.createElement('div');
    brandInfo.className = 'brand-info centered';

    let title = document.createElement('h2');
    title.className = 'title-default regular';
    title.textContent = 'VILKA ÄR [BRAND]?';

    let text = document.createElement('p');
    text.className = 'text-default light';
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
    countryName.className = 'title-small regular';
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
    showProgramsButton.className = 'text-default semi-bold space-between'
    showProgramsButton.innerHTML = `<p>Visa program</p> <i id="trailing-icon">${trailingIcon}</i>`;
    showProgramsButton.href = 'search.html';
    showProgramsButton.addEventListener('click', () => {
        sessionStorage.setItem('countryId', country.id);
    });
    countryImg.append(showProgramsButton);
    
    
    wrapper.append(header, countryImg); 
    
    return wrapper;
}

function createCompareInfo(){
    let wrapper = document.createElement('section');
    wrapper.className = 'compare-info-section centered';

    let title = document.createElement('h2');
    title.className = 'title-default regular'
    title.textContent = 'Beslutsångest?';

    let text = document.createElement('p');
    text.className = 'text-default regular';
    text.textContent = 'Med jämförverktyget får du en snabb överblick av kurser och kan enkelt ställa dina favoriter mot varandra.';

    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'c-button-container';
    let button = document.createElement('a');
    button.href = 'comapare.html';
    button.className = 'text-default light space-between';
    button.innerHTML = `<p>Jämför program</p><i>${trailingIcon}</i>`;
    buttonContainer.append(button);

    wrapper.append(title, text, buttonContainer)

    return wrapper;
}

function createBackground() {
    let background = document.createElement('section');
    background.className = 'background';

    let firstCircle = document.createElement('div');
    firstCircle.className = 'first-circle';
    firstCircle.innerHTML = backgroundCircle;

    let secondCircle = document.createElement('div');
    secondCircle.className = 'second-circle';
    secondCircle.innerHTML = backgroundCircle;

    background.append(firstCircle, secondCircle);

    return background;
}