"use strict";

render("header", createCompareInfo());

createProgrammeElements("favourites", parseFavoritesFromLS("object"));

window.addEventListener("storage", e => {
  createProgrammeElements("favourites", parseFavoritesFromLS("object"));
});

function createCompareInfo(){
  let wrapper = document.createElement('section');
  wrapper.className = 'compare-info-section centered';

  let title = document.createElement('h2');
  title.className = 'title-default regular'
  title.textContent = 'Favoriter';

  let text = document.createElement('p');
  text.className = 'text-default regular';
  text.textContent = 'Här kan du se de program du sparat som favoriter. Om du vill jämföra några av programmen kan du gå vidare med knappen nedanför:';

  let buttonContainer = document.createElement('div');
  buttonContainer.className = 'c-button-container centered';
  let button = document.createElement('a');
  button.href = 'comapare.html';
  button.className = 'text-default light space-between button-solid--cream button-square';
  button.innerHTML = `<p>Jämför program</p><i class="centered">${trailingIcon}</i>`;
  buttonContainer.append(button);

  wrapper.append(title, text, buttonContainer)

  return wrapper;
}