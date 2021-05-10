"use strict";

let countryElementContainer = document.querySelector('.country-cards-container');

createCountryElement(DB.COUNTRIES)

function createCountryElement(countries) {
    countries.forEach(country => {
        let countryElement = document.createElement('div');
        countryElement.classList.add('countryElement');

        let countryName = document.createElement('h3');
        countryName.textContent = country.name;

        let countryInfo = document.createElement('p');
        countryInfo.textContent = country.text;

        let countryImg = document.createElement('div');
        countryImg.style.backgroundImage = `url(assets/images/${country.imagesNormal[1]})`;

        let showProgramsButton = document.createElement('button');
        countryImg.append(showProgramsButton);
        
        
        countryElement.append(countryName, countryInfo, countryImg);
        countryElementContainer.append(countryElement);

        // render(countryElement, '.country-cards-container')
    });
}