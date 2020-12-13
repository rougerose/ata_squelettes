// import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";

// gsap.registerPlugin(Draggable);

export class Modal {
	constructor(id) {
		this.id = id;
		this._modal = document.getElementById(id);
		this._btn = this._modal.querySelector("button");
		this._clickListener = this.clickToggleModal.bind(this);
		this._btn.addEventListener("click", this.clickToggleModal.bind(this));
		this.isOpen = false;

		// console.log(this._height, this._bounds);
		/*
		document.body.scrollHeight - this._modal.offsetTop
		*/
		// let that = this;
		// Draggable.create("#" + this.id, {
		// 	type: "y",
		// 	bounds: { minY: 50, maxY: -125 },
		// 	// edgeResistance: 0.5,
		// 	dragResistance: 0.7,
		// 	zIndexBoost: false,
		// 	liveSnap: true,
		// 	onMove: function () {
		// 		console.log(this.y);
		// 	},
		// 	onDragEnd: function () {
		// 		if (this.y <= -10) {
		// 			that.toggleModal("open");
		// 		} else if (this.y >= 5) {
		// 			that.toggleModal("close");
		// 		}
		// 	},
		// });
	}

	clickToggleModal(event) {
		event.preventDefault();
		console.log("toggleModal", this, event);
		if (!this.isOpen) {
			return;
		}
		console.log(event.target, this._modal.dataset.visibilityState);

		if (this._modal.dataset.visibilityState === "preview") {
			console.log("toggle Preview -> All");
			this._modal.dataset.visibilityState = "all";
			this._modal.style.top = 0;
			this._modal.removeEventListener("click", this._clickListener);
		} else if (this._modal.dataset.visibilityState === "all") {
			console.log("toggle All -> Close");
			// this._modal.dataset.visibilityState = "";
			// this._modal.style.top = "100%";
			this.close();
		}
	}

	open(data) {
		// si déjà ouvert, fermer avant de charger le html
		if (this.isOpen) {
			this.close().then(() => {
				this._buildModal(data);
			});
		} else {
			this._buildModal(data);
		}
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
		let modal = this._modal;
		if (this._modal.dataset.visibilityState === "preview") {
			this._modal.removeEventListener("click", this._clickListener);
		}
		// https://gist.github.com/davej/44e3bbec414ed4665220
		return new Promise((resolve) => {
			modal.style.top = "100%";
			modal.dataset.visibilityState = "";
			const transitionendListener = (event) => {
				modal.removeEventListener(
					"transitionend",
					transitionendListener
				);
				resolve();
			};
			modal.addEventListener("transitionend", transitionendListener);
		});
	}

	_buildModal(data) {
		const properties = data.properties;
		// Convertir le json en fonction du gabarit html
		const html = this._createHTML(properties);
		// Ajouter le contenu html à conteneur
		const htmlContainer = this._modal.querySelector(".mp-Modal_Content");
		htmlContainer.firstElementChild.innerHTML = html;
		// Avant d'afficher vérifier que les images de la modale
		// sont chargées(via la lib imagesLoaded).
		// Cela permet de calculer une hauteur de header (preview) plus précise.
		imagesLoaded(this._modal, () => {
			let previewHeight = this._calcPreviewHeight();
			this._modal.style.top = previewHeight + "px";
			this._modal.dataset.visibilityState = "preview";
		});
		this._modal.addEventListener("click", this._clickListener);
	}

	_calcPreviewHeight() {
		return 0;
		// let parentHeight = this._modal.offsetParent.offsetHeight;
		// let content = this._modal.children[1];
		// let bodyProfile = content.children[0].children[1].firstElementChild;
		// let padding = 20;
		// let previewHeight = parentHeight - (bodyProfile.offsetTop + padding);
		// return previewHeight;
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
