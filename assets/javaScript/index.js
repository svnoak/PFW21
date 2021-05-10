"use strict";

createCountryElement(DB.COUNTRIES)

function createCountryElement(countries) {
    countries.forEach(country => {
        let countryElement = document.createElement('div');
        countryElement.className = 'countryElement';

        let countryName = document.createElement('h3');
        countryName.className = 'title-default';
        countryName.textContent = country.name;

        let countryInfo = document.createElement('p');
        countryInfo.className = 'text-small';
        countryInfo.textContent = country.text;
        countryInfo.innerHTML = `${countryInfo.innerHTML.substring(0,70)}...`;

        let countryImg = document.createElement('div');
        countryImg.style.backgroundImage = `url(assets/images/${country.imagesNormal[1]})`;

        let showProgramsButton = document.createElement('button');
        showProgramsButton.className = 'button-large button-square text-small'
        showProgramsButton.textContent = 'Visa program';
        countryImg.append(showProgramsButton);
        
        
        countryElement.append(countryName, countryInfo, countryImg);
        render(countryElement, 'country-cards-container');
    });
}