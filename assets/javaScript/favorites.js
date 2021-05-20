"use strict";

render("body", createCompareInfo());

createProgrammeElements("favourites", parseFavoritesFromLS("object"));

window.addEventListener("storage", e => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object"));
});

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
  button.className = 'text-default light space-between button-solid--cream button-square';
  button.innerHTML = `<p>Jämför program</p><i class="centered">${trailingIcon}</i>`;
  buttonContainer.append(button);

  wrapper.append(title, text, buttonContainer)

  return wrapper;
}