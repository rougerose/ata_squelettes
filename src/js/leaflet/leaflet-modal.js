(function () {
	// repris et adapté de https://github.com/noerw/leaflet-sidebar-v2
	/**
	 * @name Modal
	 * @class L.Control.Modal
	 * @extends L.Control
	 * @param {Object} [options]
	 */
	L.Control.Modal = L.Control.extend({
		options: {
			container: null,
			position: "left",
		},

		/**
		 * Créer la fenêtre modal
		 */
		initialize: function (options) {
			this._isOpen = false;
			this._isOpenFull = false;
			this._jsonData = null;
			this._actionBtn;
			this._headerContent;
			this._bodyContent;
			this._zoomControl = { position: null, container: null };

			L.setOptions(this, options);
			return this;
		},

		/**
		 * Ajouter la fenêtre modal sur une carte
		 */
		onAdd: function (map) {
			let container;

			// use container from previous onAdd()
			container = this._container;

			// use the container given via options.
			if (!container) {
				container =
					this._container ||
					typeof this.options.container === "string"
						? L.DomUtil.get(this.options.container)
						: this.options.container;
			}

			container.dataset.position = "close";

			// register and init actionBtn
			this._actionBtn = container.querySelector("#ModalAction");
			this._initActionBtn(this._actionBtn);

			// register header and body content
			this._headerContent = container.querySelector(
				".mp-Modal_HeaderContent"
			);
			this._bodyContent = container.querySelector(".mp-Modal_Body");

			// register map height
			// this._mapHeight = container.offsetParent.offsetHeight;

			// leaflet moves the returned container to the right place in the DOM
			return container;
		},

		/**
		 * Retirer la modal de la carte
		 * Fonction appelée par Leaflet remove(). Présente pour mémoire, sans effet ici.
		 */
		onRemove: function (map) {},

		_onResize: function () {
			if (this._isOpen && !this._isOpenFull && this._jsonData) {
				const json = this._jsonData;
				this.close();
				this.open(json);
			}
		},

		/**
		 * Ajouter la modal comme "control" dans la carte.
		 * L'objet est inséré avant le premier enfant dans le DOM de la carte.
		 */
		addTo: function (map) {
			this.onRemove();
			this._map = map;
			this._container = this.onAdd(map);

			// Ajouter au conteneur mp-Modal_Content la classe principale
			// du contenu d'un marqueur Association
			const contentArticle = this._container.querySelector(
				".mp-Modal_Content"
			);
			contentArticle.classList.add("mp-OrgProfile");

			L.DomUtil.addClass(this._container, "leaflet-control");
			L.DomUtil.addClass(
				this._container,
				"leaflet-modal-" + this.getPosition()
			);
			if (L.Browser.touch)
				L.DomUtil.addClass(this._container, "leaflet-touch");

			// when adding to the map container, we should stop event propagation
			L.DomEvent.disableScrollPropagation(this._container);
			L.DomEvent.disableClickPropagation(this._container);
			L.DomEvent.on(
				this._container,
				"contextmenu",
				L.DomEvent.stopPropagation
			);

			// insert as first child of map container (important for css)
			map._container.insertBefore(
				this._container,
				map._container.firstChild
			);

			map.on("resize", this._onResize, this);

			return this;
		},

		toggle: function (position, height) {
			const promesse = new Promise((resolve, reject) => {
				const self = this;
				let unit = "px";
				const handler = (event) => {
					self._container.removeEventListener(
						"transitionend",
						handler
					);
					resolve();
				};
				if (position === "full") {
					this._actionBtn.classList.remove("is-ready-to-animate");
				}
				this._container.addEventListener("transitionend", handler);
				this._container.style.transform = `translateY(${height}${unit})`;
				this._container.dataset.position = position;
			});

			if (position === "preview") {
				promesse.then(() => {
					this._actionBtn.classList.add("is-ready-to-animate");
					this._actionBtn.dataset.position = position;
					this._translateZoomControlPosition(position, height);
					this._isOpen = true;
					this._isOpenFull = false;
				});
			} else if (position === "full") {
				promesse.then(() => {
					this._actionBtn.classList.add("is-ready-to-animate");
					this._actionBtn.dataset.position = position;
					this._translateZoomControlPosition(position);
					this._isOpen = true;
					this._isOpenFull = true;
				});
			} else if (position === "close") {
				this._container.style.transform = "translateY(100%)";
				this._container.dataset.position = position;
				this._translateZoomControlPosition(position);
				this._actionBtn.dataset.position = position;
				this._actionBtn.classList.remove("is-ready-to-animate");
				this._isOpen = false;
				this._isOpenFull = false;
			}
		},

		open: function (json) {
			// stocker les données json pour une réutilisation éventuelle avec _onResize
			this._jsonData = json;
			// si la modale est déjà ouverte, fermer avant de charge le html.
			if (this._isOpen) {
				const close = new Promise((resolve, reject) => {
					const self = this;
					const handler = (event) => {
						self._container.removeEventListener(
							"transitionend",
							handler
						);
						resolve();
					};
					self._container.addEventListener("transitionend", handler);
					self.close();
				});
				close.then(() => {
					this._addContent(json);
				});
			} else {
				this._addContent(json);
			}
		},

		close: function () {
			this.toggle("close", 100);
			// supprimer les données json enregistrées lors de open()
			this._jsonData = null;
		},

		// Repositionner les boutons de zoom de la carte
		// en fonction de la position de la modal.
		_translateZoomControlPosition: function (position, previewHeight) {
			if (this._zoomControl.container === null) {
				this._zoomControl.container = this._map.zoomControl.getContainer();
				this._zoomControl.position = this._map.zoomControl.getPosition();
			}
			if (this._zoomControl.position.indexOf("bottom") !== -1) {
				// zoom au-dessus de la modal en mode "preview"
				if (position === "preview") {
					const mapHeight = this._container.offsetParent.offsetHeight;
					const translateY = mapHeight - previewHeight;
					this._zoomControl.container.style.transform = `translateY(-${translateY}px)`;
					// sinon position normale
				} else if (position === "full" || position === "close") {
					this._zoomControl.container.style.transform = "";
				}
			}
		},

		_initActionBtn: function (btnAction) {
			// click listner
			this._clickActionBtn(btnAction, "on");

			btnAction.dataset.position = "close";

			const circle = btnAction.querySelector("circle");
			if (circle) {
				const circumference = (
					2 *
					Math.PI *
					circle.getAttribute("r")
				).toFixed(2);
				circle.setAttribute("stroke-dashoffset", circumference);
				circle.setAttribute("stroke-dasharray", circumference);
			}
		},

		_clickActionBtn: function (actionBtn, on) {
			if (on === "on") {
				L.DomEvent.on(actionBtn, "click", this._onclickActionBtn, this);
			} else {
				L.DomEvent.off(actionBtn, "click", this._onclickActionBtn);
			}
		},

		_onclickActionBtn: function () {
			const position = this._container.dataset.position;
			if (position === "preview") {
				this.toggle("full", 0);
			} else if (position === "full") {
				this.toggle("close", 100);
			}
		},

		_addContent: function (json) {
			const properties = json.properties;
			// Header
			const headerMarkup = this._createHeaderMarkup(properties);
			// Body
			const bodyMarkup = this._createBodyMarkup(properties);

			this._headerContent.innerHTML = headerMarkup;
			this._bodyContent.innerHTML = bodyMarkup;

			// Avant d'afficher, vérifer que les images sont bien chargées
			// (via la lib imagesLoaded).Cela permet de calculer
			// une hauteur de preview (header) plus précise.
			imagesLoaded(this, () => {
				const previewHeight = this._calcPreviewHeight();
				this.toggle("preview", previewHeight);
			});
		},

		_calcPreviewHeight: function () {
			const parentHeight = this._container.offsetParent.offsetHeight;
			const bodyContentOffsetTop = this._bodyContent.offsetTop;
			const previewHeight = parentHeight - (bodyContentOffsetTop + 24);

			return previewHeight;
		},

		_createHeaderMarkup: function (json) {
			let badgeFigure = ``;
			if (json.logo !== "") {
				badgeFigure = `
			<figure class="mp-OrgProfile_Badge">
				<img class="mp-OrgProfile_Logo" src="${json.logo}" alt="${json.nom}">
			</figure>
			`;
			}

			const nameDiv = `
				<div class="mp-OrgProfile_Name">
					<h1>${json.nom}</h1>
				</div>
			`;

			const headerDiv = `
				<div class="mp-OrgProfile_Header">
					${badgeFigure}
					${nameDiv}
				</div>
			`;

			return headerDiv;
		},

		_createBodyMarkup: function (json) {
			// Adresse
			// la ville devrait être au moins présente, sinon rien n'est afficher.
			let adresse = ``;
			if (json.ville !== "") {
				adresse = `
				<h2>Adresse</h2>
				<p class="mp-OrgProfile_Address">
				${json.voie ? `<span>${json.voie}</span>` : ``}
				${json.complement ? `<span>${json.complement}</span>` : ``}
				<span>${json.code_postal ? `${json.code_postal}` : ``} ${json.ville}</span>
			`;
			}

			// Activités
			let activites = ``;
			if (json.activites !== "") {
				const activitesArray = json.activites.split("|");
				activites = `
				<h2>Activités</h2>
				<ul class="mp-OrgProfile_List">
				${activitesArray
					.map(
						(activite, index) =>
							`<li class="mp-OrgProfile_ListItem">${activite}</li>`
					)
					.join("")}
				</ul>
			`;
			}

			// En ligne (site web et réseaux sociaux)
			let online = ``;
			if (
				json.url_site !== "" ||
				json.facebook !== "" ||
				json.twitter !== "" ||
				json.instagram !== ""
			) {
				online = `
					<h2>En ligne</h2>
					${
						json.url_site
							? `<p class="mp-OrgProfile_Online">
					<a class="mp-OrgProfile_WebLink" href="${json.url_site}">${json.url_site}</a>
					</p>`
							: ``
					}
					<p class="mp-OrgProfile_Online mp-OrgProfile_Online-social">
						${
							json.facebook
								? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-fb mp-OrgProfile_SocialLink-on" href="${json.facebook}"> </a>`
								: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-fb mp-OrgProfile_SocialLink-off"> </span>`
						}
						${
							json.twitter
								? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-tw mp-OrgProfile_SocialLink-on" href="${json.twitter}"> </a>`
								: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-tw mp-OrgProfile_SocialLink-off"> </span>`
						}
						${
							json.instagram
								? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-ig mp-OrgProfile_SocialLink-on" href="${json.instagram}"> </a>`
								: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-ig mp-OrgProfile_SocialLink-off"> </span>`
						}
					</p>
				`;
			}

			const sectionInformations = `
				<section class="mp-OrgProfile_Informations">
					${adresse}
					${activites}
					${online}
				</section>
			`;

			const sectionMembreFraap = `
				<section class="mp-OrgProfile_BagdeContainer">
					<figure class="mp-OrgProfile_Badge mp-OrgProfile_Badge-membreFraap">
						<img class="mp-OrgProfile_LogoMembreFraap" src="${
							json.membre_fraap_logo
						}" class="mp-OrProfile_FraapLogo" alt="${
				parseInt(json.membre_fraap)
					? `Cette association est membre de la FRAAP`
					: `Cette association n'est pas membre de la FRAAP`
			}">
						<figcaption class="mp-OrgProfile_Tooltip">${
							parseInt(json.membre_fraap)
								? `Cette association est membre de la <a href="https://fraap.org">FRAAP</a>`
								: `Cette association n'est pas membre de la <a href="https://fraap.org">FRAAP</a>`
						}</figcaption>
					</figure>
				</section>
			`;

			const bodyDiv = `
				<div class="mp-OrgProfile_Body">
					${sectionInformations}
					${sectionMembreFraap}
				</div>
			`;

			return bodyDiv;
		},
	});

	L.control.modal = function (options) {
		return new L.Control.Modal(options);
	};
})();
