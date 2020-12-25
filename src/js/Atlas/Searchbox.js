import { config } from "./config";

export class Searchbox {
	constructor(id, MapInstance) {
		this._container = document.getElementById(id);
		this._map = MapInstance;
		this._labels = [];
		this._inputs = [];
		this._inputsId = [];
		this._buttonsCancel = [];
		this._buttonsCancelId = [];
		this._kwLabels = [];
		this._kwValues = [];

		this._labels = this._container.querySelectorAll("label");
		for (let index = 0; index < this._labels.length; index++) {
			this._labels[index].classList.add("js-Searchbox_Label");
		}

		this._inputs = this._container.querySelectorAll("input[type=text]");
		for (let index = 0; index < this._inputs.length; index++) {
			const input = this._inputs[index];
			this._inputsId[index] = input.dataset.id;
			input.addEventListener("focus", this._oneventInput);
			input.addEventListener("blur", this._oneventInput);
		}

		this._buttonsCancel = this._container.querySelectorAll(
			"button[type=reset]"
		);
		for (let index = 0; index < this._buttonsCancel.length; index++) {
			const btn = this._buttonsCancel[index];
			let id = btn.dataset.relId;
			this._buttonsCancelId[index] = id;
			const idx = this._inputsId.indexOf(id);
			const input = this._inputs[idx];
			btn.addEventListener("click", this._onclickCancelBtn.bind(input));
		}
	}

	_oneventInput(event) {
		const parent = this.offsetParent;
		if (event.type === "focus") {
			parent.classList.add("is-focused");
		} else if (event.type == "blur" && event.target.value == "") {
			parent.classList.remove("is-focused");
		}
	}

	_onclickCancelBtn(event) {
		event.preventDefault();
		const input = this;
		// effacer la saisie
		input.value = null;
		input.offsetParent.classList.remove("is-focused");
	}

	addKeyword(keyword) {
		const label = keyword.label;
		const value = keyword.value;

		// Vérifier si le mot-clé n'existe pas déjà dans le tableau
		if (this._kwValues.indexOf(value) == -1) {
			this._kwLabels.push(label);
			this._kwValues.push(value);

			// Afficher le mot-clé saisi
			const markup = this._addMarkup(label, value);

			this._parseGeoJsonSearch(this._kwValues);
		}
	}

	_addMarkup(label, value) {
		// <li>
		const li = document.createElement("li");
		li.className = config.keywords.liClassName;

		// span
		const span = document.createElement("span");
		const classStr = config.keywords.labelClassName;
		// la clé permet de déterminer l'icone de la catégorie
		const key = value.split(":");

		let category;
		switch (key[0]) {
			case "id_association":
				category = "-org";
				break;
			case "id_adresse":
				category = "-city";
				break;
			case "id_mot":
				category = "-activity";
		}

		span.className = classStr + " " + classStr + category;
		span.appendChild(document.createTextNode(label));

		// <button>
		const btn = document.createElement("button");
		btn.className = config.keywords.btnClassName;
		btn.dataset.value = value;
		btn.addEventListener("click", this.removeKeyword);

		// Append span and btn to li
		li.appendChild(span);
		li.appendChild(btn);

		// Identifier le conteneur
		const container = this._container.querySelector(config.keywords.containerId);

		// Une liste est déjà présente ?
		let ul = container.firstChild;
		if (!ul) {
			ul = document.createElement("ul");
			ul.className = config.keywords.ulClassName;
		} else {
			// Todo : vérifier si message "Aucun résultat" est présent
		}

		ul.appendChild(li);
		container.appendChild(ul);
	}

	_parseGeoJsonSearch(keywords) {
		// keyword =
		if (Array.isArray(keywords) && keywords.length > 0) {
			// parametres de la requete
			const limit = this._map._json.limit;
			const query = {
				id_association: [],
				id_mot: [],
				id_adresse: [],
				limit: limit,
			};

			// collecter l'id_objet de chaque mot-clé
			for (let index = 0; index < keywords.length; index++) {
				const keyword = keywords[index].split(":");
				const id = keyword[0];
				for (const key in query) {
					if (key === id) {
						query[key].push(keyword[1]);
					}
				}
			}

			let args = {};
			const url = "http.api/collectionjson/associations";

			jQuery.extend(true, args, query);
			// const q = $.param(query);
			jQuery.getJSON(url, args, (data) => {
				if (data) {
					console.log(data);
				}
			});
		}
	}
}
