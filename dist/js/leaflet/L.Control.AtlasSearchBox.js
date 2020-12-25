L.Control.AtlasSearchBox = L.Control.extend({
	options: {
		container: "SearchBox",
		position: "topleft",
		keywords: {
			containerId: "#js-Keywords",
			ulClassName: "mp-Keywords_List",
			liClassName: "mp-Keywords_Item",
			labelClassName: "mp-Keywords_Label",
			btnClassName: "o-btn mp-Keywords_BtnDelete",
		},
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
		this._labels = [];
		this._inputs = [];
		this._inputsId = [];
		this._buttonsCancel = [];
		this._buttonsCancelId = [];
		this._kwLabels = [];
		this._kwValues = [];
	},

	onAdd: function (map) {
		let container;
		// use container from previous onAdd()
		container = this._container;
		// use the container given via options.
		if (!container) {
			container =
				this._container || typeof this.options.container === "string"
					? L.DomUtil.get(this.options.container)
					: this.options.container;
		}
		return container;
	},

	onRemove: function (map) {},

	addTo: function (map) {
		this.remove();
		this._map = map;
		this._container = this.onAdd(map);

		L.DomUtil.addClass(this._container, "leaflet-control");
		L.DomUtil.addClass(
			this._container,
			"leaflet-atlasSearchBox-" + this.getPosition()
		);
		if (L.Browser.touch)
			L.DomUtil.addClass(this._container, "leaflet-touch");

		// when adding to the map container, we should stop event propagation
		// L.DomEvent.disableScrollPropagation(this._container);
		// L.DomEvent.disableClickPropagation(this._container);
		L.DomEvent.on(
			this._container,
			"contextmenu",
			L.DomEvent.stopPropagation
		);

		this._map._container.insertBefore(
			this._container,
			this._map._container.firstChild
		);

		this._initLayout();

		this._map.on("resize", this._onResize, this);

		return this;
	},

	_initLayout: function () {
		this._labels = this._container.querySelectorAll("label");
		for (let index = 0; index < this._labels.length; index++) {
			this._labels[index].classList.add("js-Searchbox_Label");
		}

		this._inputs = this._container.querySelectorAll("input[type=text]");
		for (let index = 0; index < this._inputs.length; index++) {
			const input = this._inputs[index];
			this._inputsId[index] = input.dataset.id;
			input.addEventListener("focus", this._onEventInput);
			input.addEventListener("blur", this._onEventInput);
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
	},

	_onResize: function () {
		console.log("onResize atlasSearchBox");
	},

	_onEventInput: function (event) {
		const parent = this.offsetParent;
		if (event.type === "focus") {
			parent.classList.add("is-focused");
		} else if (event.type == "blur" && event.target.value == "") {
			parent.classList.remove("is-focused");
		}
	},

	_onclickCancelBtn: function (event) {
		event.preventDefault();
		const input = this;
		// effacer la saisie
		input.value = null;
		input.offsetParent.classList.remove("is-focused");
	},

	addKeywords: function (keyword) {
		const label = keyword.label;
		const value = keyword.value;

		// Vérifier si le mot-clé n'existe pas déjà dans le tableau
		if (this._kwValues.indexOf(value) == -1) {
			this._kwLabels.push(label);
			this._kwValues.push(value);

			// Afficher le mot-clé saisi
			const markup = this._addMarkup(label, value);

			// this._parseGeoJsonSearch(this._kwValues);
		}
	},

	_addMarkup: function (label, value) {
		// <li>
		const li = document.createElement("li");
		li.className = this.options.keywords.liClassName;

		// span
		const span = document.createElement("span");
		const classStr = this.options.keywords.labelClassName;
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
		btn.className = this.options.keywords.btnClassName;
		btn.dataset.value = value;
		btn.addEventListener("click", this.removeKeyword);

		// Append span and btn to li
		li.appendChild(span);
		li.appendChild(btn);

		// Identifier le conteneur
		const container = this._container.querySelector(
			this.options.keywords.containerId
		);

		// Une liste est déjà présente ?
		let ul = container.firstChild;
		if (!ul) {
			ul = document.createElement("ul");
			ul.className = this.options.keywords.ulClassName;
		} else {
			// Todo : vérifier si message "Aucun résultat" est présent
		}

		ul.appendChild(li);
		container.appendChild(ul);
	},
});

// Initialisation
L.control.atlasSearchBox = function (options) {
	return new L.Control.AtlasSearchBox(options);
};
