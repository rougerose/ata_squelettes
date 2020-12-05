import { config } from "../ata_config";
import { ata_recherche_parseGeoJson } from "./index";

let keywordsLabel = [];
let keywordsValue = [];

// Ajouter le mot-clé à la liste des critères de recherche
// Fonction appelée par autocomplete_callback
export function addKeyword(keyword) {
	if (keyword.label && keyword.value) {
		let label = keyword.label;
		let value = keyword.value;
		// Le mot-clé existe déjà dans le tableau principal
		let alreadyExists = keywordsValue.indexOf(value);
		if (alreadyExists == -1) {
			keywordsLabel.push(label);
			keywordsValue.push(value);
			// index du mot dans le tableau principal
			// let index = keywordsLabel.indexOf(label);
			let item = keywordToItem(label, value);
			let list = itemToList(item);
			// recharger la carte en fonction de la recherche
			if (list) {
				ata_recherche_parseGeoJson(keywordsValue);
			}
		}
	} else {
		return false;
	}
}

function deleteKeyword() {
	let btn = this;
	let value = btn.dataset.value;
	let index = keywordsValue.indexOf(value);

	if (index !== -1) {
		keywordsValue.splice(index, 1);
		if (keywordsValue.length == 0) {
			btn.parentElement.parentElement.remove();
		} else {
			btn.parentElement.remove();
		}
		// Recharger la carte
		ata_recherche_parseGeoJson(keywordsValue);
	}
}

// A partir des données du mot-clé, créer l'élement html
// <li><span></span><button></li>
function keywordToItem(label, value) {
	// li element
	let listItem = document.createElement("li");
	listItem.className = config.keywords.itemClassName;

	// span element
	let span = document.createElement("span");
	// identifier la clé pour afficher l'icone de la catégorie
	let key = value.split(":");
	let category = keywordCategory(key[0]);
	let className = config.keywords.labelClassName;
	span.className = className + " " + className + category;
	span.appendChild(document.createTextNode(label));

	// button element
	let btn = document.createElement("button");
	btn.className = config.keywords.btnClassName;
	btn.dataset.value = value;
	btn.addEventListener("click", deleteKeyword, false);

	// append
	listItem.appendChild(span);
	listItem.appendChild(btn);
	return listItem;
}

// L'élement <li> est ajouté à <ul> et afficher.
function itemToList(item) {
	// identifier le conteneur
	let listContainer = document.querySelector(config.keywords.containerId);

	// une liste de mots-clés est déjà présente ?
	let list = listContainer.firstChild;
	if (!list) {
		list = document.createElement("ul");
		list.className = config.keywords.listClassName;
	} else {
		// Todo : vérifier si message "Aucun résultat" est présent pour le retirer de la liste
		// Fix : stocker dans un tableau la présence du message ?
	}
	list.appendChild(item);
	listContainer.appendChild(list);
	return true;
}

function keywordCategory(str) {
	let res = "";
	switch (str) {
		case "id_association":
			res = "-org";
			break;
		case "id_adresse":
			res = "-city";
			break;
		case "id_mot":
			res = "-activity";
	}
	return res;
}
