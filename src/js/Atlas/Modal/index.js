import { config } from "../config";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

export class Modal {
	constructor(id) {
		this.id = id;
		this._modal = document.getElementById(id);
		this._btn = this._modal.querySelector("button");
		this._clickListener = this._onClickToggleModal.bind(this);
		this._btn.addEventListener("click", this._clickListener);
		this.isOpen = false;
		this.isOpenFull = false;

		// Draggable
		let self = this;
		// gsap.config({ units: { top: "%" } });
		Draggable.zIndex = config.modal.zIndex;

		// TODO à garder pour masquer la modal ?
		// gsap.set(this._modal, { y: "100%" });

		let bounds = this._applyBounds();
		this.isOpen = true; //! Test uniquement
		const seuil = 100;
		console.log(bounds);
		let dragModal = Draggable.create(self._modal, {
			type: "y",
			zIndex: config.modal.zIndex,
			edgeResistance: 0.9,
			dragResistance: 0.19,
			inertia: true,
			zIndexBoost: false,
			bounds: bounds,
			onMove: function (e) {
				console.log(this);
				// let direction = this.getDirection();
				// if (self.isOpen && self.isOpenFull) {
				// 	if (direction == "up") {
				// 		console.log("disable");
				// 		dragModal[0].disable();
				// 	}
				// }
				// else if (self.isOpen && !self.isOpenFull) {
				// 	// preview
				// 	if (direction == "up") {
				// 		this.endDrag();
				// 		gsap.to(self._modal, { y: this.minY });
				// 		self.isOpen = true;
				// 		self.isOpenFull = true;
				// 	}
				// }
				if (self.isOpen && !self.isOpenFull && this.y <= this.maxY) {
					console.log("ouvrir");
					this.endDrag();
					gsap.to(self._modal, { y: this.minY });
					self.isOpen = true;
					self.isOpenFull = true;
				} else if (self.isOpen && self.isOpenFull && this.y >= this.minY && this.y < this.minY + seuil) {
					console.log("fermer");
					this.endDrag();
					gsap.to(self._modal, { y: this.maxY });
					self.isOpen = true;
					self.isOpenFull = false;
				}
			},
		});
	}

	_applyBounds(draggableEl) {
		let minVal = this._calcPreviewHeight();
		let maxVal = 0;
		return { minY: minVal, maxY: maxVal };
	}

	_onDragToggleModal(el, bool) {
		if (bool === true) {
			console.log("_onDragToggleModal isOpen (début/fermer): ", this.isOpen);
			// fermer
			gsap.to(el, { top: 100, duration: 0.2 });
			this.isOpen = false;
			el.style.top = "";
			el.dataset.visibilityStatus = "";
			console.log(
				"_onDragToggleModal isOpen (fin/fermer): ",
				this.isOpen
			);
		} else {
			console.log(
				"_onDragToggleModal isOpen (début/ouvrir): ",
				this.isOpen
			);
			// ouvrir
			gsap.to(el, { top: 0, duration: 0.2 });
			this.isOpen = true;
			console.log(
				"_onDragToggleModal isOpen (fin/ouvrir): ",
				this.isOpen
			);
			el.dataset.visibilityStatus = "all";
		}
	}

	_onClickToggleModal(event) {
		console.log("_onClickToggleModal isOpen (début): ", this.isOpen);
		if (!this.isOpen) {
			return;
		}
		// console.log(event.target, this._modal.dataset.visibilityStatus);

		if (this._modal.dataset.visibilityStatus === "preview") {
			console.log("toggle Preview -> All");
			this._modal.dataset.visibilityStatus = "all";
			this._modal.style.transform = "translateY(0)";
			// this._modal.removeEventListener("click", this._clickListener);
			this.isOpen = true;
			console.log("_onClickToggleModal (fin/cas preview): ", this.isOpen);
		} else if (this._modal.dataset.visibilityStatus === "all") {
			console.log("toggle All -> Close");
			this._modal.dataset.visibilityStatus = "";
			this._modal.style.transform = "translateY(100%)";
			this.isOpen = false;
			console.log(
				"_onClickToggleModal isOpen (fin/cas all): ",
				this.isOpen
			);
		}
	}

	open(data) {
		console.log("open isOpen (debut): ", this.isOpen);
		// si déjà ouvert, fermer avant de charger le html
		if (this.isOpen) {
			this.close().then(() => {
				console.log("then");
				this._buildModal(data);
			});
		} else {
			this._buildModal(data);
		}
		this.isOpen = true;
		console.log("open isOpen (fin): ", this.isOpen);
	}

	close() {
		return new Promise((resolve, reject) => {
			console.log("close isOpen (début): ", this.isOpen);
			console.log("promesse");
			let self = this;
			if (self._modal.dataset.visibilityStatus === "preview") {
				// self._modal.removeEventListener("click", self._clickListener);
			}
			let transitionendListener = function (event) {
				self._modal.removeEventListener(
					"transitionend",
					transitionendListener
				);
				resolve();
				console.log("resolve");
				this.isOpen = false;
			}
			self._modal.addEventListener(
				"transitionend",
				transitionendListener
			);
			self._modal.style.transform = "translateY(78%)";
		});
	}

	// close() {
	// 	console.log("close isOpen (début): ", this.isOpen);
	// 	this.isOpen = false;
	// 	let modal = this._modal;
	// 	let self = this;
	// 	if (modal.dataset.visibilityStatus === "preview") {
	// 		modal.removeEventListener("click", self._clickListener);
	// 	}
	// 	// https://gist.github.com/davej/44e3bbec414ed4665220
	// 	// return new Promise((resolve, reject) => {
	// 	// 	// modal.style.top = "100%";
	// 	// 	const transitionendListener = (event) => {
	// 	// 		modal.removeEventListener(
	// 	// 			"transitionend",
	// 	// 			transitionendListener
	// 	// 		);
	// 	// 		modal.dataset.visibilityStatus = "";
	// 	// 		console.log("close isOpen (fin): ", this.isOpen);
	// 	// 		resolve();
	// 	// 	};
	// 	// 	modal.addEventListener("transitionend", transitionendListener);
	// 	// });
	// }

	_buildModal(data) {
		const properties = data.properties;

		// Convertir le json en fonction du gabarit html
		const html = this._createHTML(properties);

		// Ajouter le contenu html dans le conteneur
		const htmlContainer = this._modal.querySelector(".mp-Modal_Content");
		htmlContainer.innerHTML = html;

		// Avant d'afficher, vérifier que les images de la modale
		// sont bien chargées(via la lib imagesLoaded).
		// Cela permet de calculer une hauteur de header (preview) plus précise.
		imagesLoaded(this._modal, () => {
			let previewHeight = this._calcPreviewHeight();
			console.log(previewHeight);
			// this._modal.style.top = previewHeight + "px";
			this._modal.style.transform = `translateY(${previewHeight}px)`;
			this._modal.dataset.visibilityStatus = "preview";
			// this._modal.addEventListener("click", this._clickListener);
		});
	}

	_calcPreviewHeight() {
		let parentHeight = this._modal.offsetParent.offsetHeight;
		let bodyContent = this._modal.querySelector(".mp-OrgProfile_Body");
		let padding = 24;
		let previewHeight = parentHeight - (bodyContent.offsetTop + padding);

		return previewHeight;
	}

	_createHTML(data) {
		const profileName = `
			<div class="mp-OrgProfile_Name">
				<h1>${data.nom}</h1>
				<p class="mp-OrgProfile_Address">
					${data.voie ? `<span>${data.voie}</span>` : ``}
					${data.complement ? `<span>${data.complement}</span>` : ``}
					<span>${data.code_postal} ${data.ville}</span>
				</p>
			</div>
		`;

		const profileLogo = `
			<div class="mp-OrgProfile_BagdeContainer">
				<figure class="mp-OrgProfile_Badge">
					<img class="mp-OrgProfile_Logo" src="${data.logo}" alt="">
				</figure>
			</div>
		`;

		let profileActivites = ``;

		if (data.activites) {
			const activitesArray = data.activites.split("|");
			profileActivites = `
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

		let profileOnline = ``;
		if (data.url_site || data.facebook || data.twitter || data.instagram) {
			profileOnline = `
			<h2>En ligne</h2>
			${
				data.url_site
					? `<p class="mp-OrgProfile_Online">
			<a class="mp-OrgProfile_WebLink" href="${data.url_site}">${data.url_site}</a>
			</p>`
					: ``
			}
			<p class="mp-OrgProfile_Online mp-OrgProfile_Online-social">
				${
					data.facebook
						? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-fb mp-OrgProfile_SocialLink-on" href="${data.facebook}"> </a>`
						: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-fb mp-OrgProfile_SocialLink-off"> </span>`
				}
				${
					data.twitter
						? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-tw mp-OrgProfile_SocialLink-on" href="${data.twitter}"> </a>`
						: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-tw mp-OrgProfile_SocialLink-off"> </span>`
				}
				${
					data.instagram
						? `<a class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-ig mp-OrgProfile_SocialLink-on" href="${data.instagram}"> </a>`
						: `<span class="mp-OrgProfile_SocialLink mp-OrgProfile_SocialLink-ig mp-OrgProfile_SocialLink-off"> </span>`
				}
			</p>
			`;
		}

		return `
		<article class="mp-OrgProfile">
			<header class="mp-OrgProfile_Header">
				${profileName}
				${profileLogo}
			</header>
			<section class="mp-OrgProfile_Body">
				<div class="mp-OrgProfile_Informations">
					${profileActivites}
					${profileOnline}
				</div>
				<div class="mp-OrgProfile_BagdeContainer">
					<figure class="mp-OrgProfile_Badge mp-OrgProfile_Badge-membreFraap">
						<img class="mp-OrgProfile_LogoMembreFraap"
							src="${data.membre_fraap_logo}"
							class="mp-OrProfile_FraapLogo" alt="${
								parseInt(data.membre_fraap)
									? `Cette association est membre de la FRAAP`
									: `Cette association n'est pas membre de la FRAAP`
							}">
						<figcaption class="mp-OrgProfile_Tooltip">${
							parseInt(data.membre_fraap)
								? `Cette association est membre de la <a href="https://fraap.org">FRAAP</a>`
								: `Cette association n'est pas membre de la <a href="https://fraap.org">FRAAP</a>`
						}</figcaption>
					</figure>
				</div>
			</section>
		</article>
		`;
	}
}
