"use strict";

function makeHero(){
    let wrapper = document.createElement("section");
    
    let header = document.createElement("header");
    header.className = ` `;
    let studyInfo = document.createeElement("section");
    studyInfo.className = ``;
    wrapper.append(header, studyInfo);
    

}

function render(element, parentElement) {
    document.getElementById(parentElement).append(element);
  }