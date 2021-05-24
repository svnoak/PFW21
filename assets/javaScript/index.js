"use strict";

// render('body', createBackground());
render('.index-wrapper', 
    createHero(), 
    createBrandInfo(), 
    createAdSpace(), 
    cardCarousell(DB.COUNTRIES), 
    createCompareInfo(
        'Beslutsångest?',
        'Med jämförverktyget får du en snabb överblick av kurser och kan enkelt ställa dina favoriter mot varandra.'
    )
);

// Skapar HERO med innehåll
function createHero() {
    let indexHero = document.createElement('div');
    indexHero.className = 'hero centered';

    let titleHero = document.createElement('h1');
    titleHero.className = 'title-hero'; // title-large
    titleHero.textContent = 'Upptäck världen som student.'

    let globeWrapper = document.createElement("div");
    globeWrapper.className = 'globe-wrapper';
    let globeRender = document.createElement('video');
    globeWrapper.append(globeRender);
    globeRender.className = 'globe-render';
    globeRender.src = "assets/video/globe.mp4";
    globeRender.autoplay = true;
    globeRender.loop = true;

    //<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/xxSuTLcA12o?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

    let textHero = document.createElement('p');
    textHero.className = 'text-default '; // semi-bold
    textHero.textContent = 'Här kan du hitta spännande program över hela världen. Vi hjälper dig att hitta rätt!';

    let buttonHero = document.createElement('a');
    buttonHero.href = 'search.html';
    buttonHero.className = 'text-large regular space-between button-round button-cta';
    buttonHero.innerHTML = `<i id="white-icon" class="centered">${searchIcon}</i> Sök efter program`;

    let pin = document.createElement('div');
    pin.classList = 'pin-header';
    pin.innerHTML = headerPin;

    let circleContainer = createBackgroundCircle();
    circleContainer.className = 'c-container top';

    indexHero.append(circleContainer, pin, titleHero, globeWrapper, textHero, buttonHero);
    
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
    showProgramsButton.className = 'text-large semi-bold space-between button-solid--cream button-square';
    showProgramsButton.innerHTML = `<p>Visa program</p> <i class="trailing-icon centered">${trailingIconRight}</i>`;
    showProgramsButton.href = `search.html?coID=${country.name.toLowerCase()}`;
    countryImg.append(showProgramsButton);
    
    
    wrapper.append(header, countryImg); 
    
    return wrapper;
}

function createBackgroundCircle() {
    let circleContainer = document.createElement('div');
    let circle = document.createElement('div');
    circle.className = 'circle';
    circleContainer.append(circle);
    circle.style.height = '140vw';
    circle.style.width = '140vw';

    return circleContainer;
}