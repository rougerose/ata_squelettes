import { config } from "../ataConfig";

export const setupSearchBox = (map) => {
	// Conteneur principal
	let searchBox = document.querySelector(config.mapSearchBox.containerClass);

	// Labels
	let labels = searchBox.querySelectorAll("label");
	for (let i = 0; i < labels.length; i++) {
		labels[i].classList.add("js-SearchBox_Label");
	}

	// Inputs
	let inputs = searchBox.querySelectorAll("input[type=text]");
	let inputsIdArray = [];
	for (let i = 0; i < inputs.length; i++) {
		let input = inputs[i];
		let id = input.dataset.id;
		inputsIdArray[i] = id;
		input.addEventListener("focus", handleInputEvent, false);
		input.addEventListener("blur", handleInputEvent, false);
	}

	// Recherche fulltext ou Recherche Villes

	// Identifier le bouton d'action Annuler
	// let cancelBtns = searchBox.querySelectorAll(
	// 	config.mapSearchBox.cancelBtnClass
	// );
	// for (let i = 0; i < cancelBtns.length; i++) {
	// 	let cancelBtn = cancelBtns[i];
	// 	let id = cancelBtn.dataset.relId;
	// 	let input = inputs[inputsIdArray.indexOf(id)];
	// 	cancelBtn.addEventListener("click", event => {
	// 		input.value = '';
	// 		console.log(input);
	// 	}, false);
	// 	// cancelBtn.onclick = handleCancelEvent.bind(input);
	// 	// console.log(input);
	// 	// cancelBtn.addEventListener("click", handleCancelEvent.bind(input), false);
	// }
}

// function handleCancelEvent() {
// 	console.log(this);
// 	this.value = '';
// 	this.blur();
// 	this.onblur = handleInputEvent;
// }

function handleInputEvent(event) {
	let input = this;
	let label = this.previousElementSibling;
	let parent = this.offsetParent;

	if (event.type === "focus") {
		input.classList.add("is-focused");
		label.classList.add("is-focused");
		parent.classList.add("is-focused");
	} else if (event.type === "blur" && event.target.value == "") {
		input.classList.remove("is-focused");
		label.classList.remove("is-focused");
		parent.classList.remove("is-focused");
	}
}
