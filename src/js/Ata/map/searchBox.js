import { config } from "../ata_config";

export const setupSearchBox = () => {
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
	// f(let i = 0; i < cancelBtns.length; i++) {
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
};

// export let autocomplete_callback = (event, ui) => {
// 	// console.log(event, ui, $);
// 	let input = event.target;
// 	let keyword = {
// 		label: ui.item.label,
// 		value: ui.item.value,
// 	};
// 	console.log(input, input.value);
// 	input.value = "";
// 	// this.value = "";
// 	return false;
// };

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



/*
let autocompleteElements = $(':data("ui-autocomplete")');
	console.log(autocompleteElements);
	$.each(autocompleteElements, function (index, el) {
		$(element).on("autocompleteresponse", acResponse.bind($(element)));
	});

	function acResponse(el) {
		console.log(el);
	}
*/