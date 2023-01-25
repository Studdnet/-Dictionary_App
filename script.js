"use strict";

const wrapper = document.querySelector(".wrapper"),
	searchInput = wrapper.querySelector("input"),
	synonyms = wrapper.querySelector(".synonyms .list"),
	infoText = wrapper.querySelector(".info-text"),
	volumeIcon = wrapper.querySelector("ul .word i"),
	removeIcon = wrapper.querySelector(".search span");
	let audio;

// data function
function data(result, word) {
	if (result.title) { //if api returns the message of can`t find the word
		infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
	} else {
		wrapper.classList.add("active");
		let definitions = result[0].meanings[0].definitions[0],
			phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

		//let's pass the particular response data to a particular html element
		document.querySelector(".word p").innerText = result[0].word;
		document.querySelector(".word span").innerText = phonetics;
		document.querySelector(".meaning span").innerText = definitions.definition;
		document.querySelector(".example span").innerText = definitions.example;
		//creating new audio obj and passing audio src
		audio = new Audio(result[0].phonetics[0].audio);

		// if there is no synonyms then hide the synonyms div
		if (definitions.synonyms[0] == undefined) {
			synonyms.parentElement.style.display = "none";
		} else {
			synonyms.parentElement.style.display = "block";
			synonyms.innerHTML = "";
			for (let i = 0; i < 5; i++) { //getting only the first 6 synonyms out of many
				let tag = `<span onclick=search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
				//passing all 5 synonyms inside synonyms div
				synonyms.insertAdjacentHTML("beforeend", tag);
			}
		}
	}
}

// search synonyms function
function search(word){
	searchInput.value = word;
	fetchApi(word);
	wrapper.classList.remove("active");
}


//fetch api function
function fetchApi(word) {
	wrapper.classList.remove("active");
	infoText.style.color = "#000";
	infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
	let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
	// fetching api response and returning it with parsing into js obj and in another then
	// method calling data function with passing api response and searched word as a argument
	fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter" && e.target.value) {
		fetchApi(e.target.value);
	}
});

volumeIcon.addEventListener("click", ()=>{
	volumeIcon.style.color = "#4D59FB";
	audio.play();
	setTimeout(()=>{
		volumeIcon.style.color = "#999";
	},800);
});

removeIcon.addEventListener("click", ()=>{
	searchInput.value = "";
	searchInput.focus();
	wrapper.classList.remove("active");
	infoText.style.color = "#9a9a9a";
	infoText.innerHTML = `Type a word and press enter to get meaning, example, pronunciation and synonyms of that typed`;
});