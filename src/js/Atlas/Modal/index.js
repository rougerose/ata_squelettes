// import { config } from "../config";

export class Modal {
	constructor(id) {
		this.id = id;
		this._modal = document.getElementById(id);
		// BtnAction
		this._clickListener = this._onclickBtnAction.bind(this);
		this._btnAction = this._modal.querySelector("#ModalAction");
		this._btnAction.addEventListener("click", this._clickListener);
		// Status
		this.isOpen = false;
		this.isOpenFull = false;
		// Ajouter au conteneur Content de la modale
		// la classe principale du contenu d'un marqueur Association
		const modalContentArticle = this._modal.querySelector(
			".mp-Modal_Content"
		);
		modalContentArticle.classList.add("mp-OrgProfile");
	}

	open(json) {
		// si la modale est déjà ouverte,
		// fermer avant de charge le html.
		if (this.isOpen) {
			this._closePromise().then(() => {
				this._addContent(json);
			});
		} else {
			this._addContent(json);
		}

		this.isOpen = true;
		this.isOpenFull = false;
	}

	toggle(position, previewHeight) {
		if (position === "preview" && parseInt(previewHeight) > 0) {
			this._modal.style.transform = `translateY(${previewHeight}px)`;
			this._modal.dataset.visibilityStatus = "preview";
			this.isOpen = true;
			this.isOpenFull = false;
		} else if (position === "close") {
			this._modal.style.transform = "translateY(100%)";
			this._modal.dataset.visibilityStatus = "";
			this.isOpen = false;
			this.isOpenFull = false;
		} else if (position === "full") {
			this._modal.style.transform = "translateY(0)";
			this._modal.dataset.visibilityStatus = "full";
			this.isOpen = true;
			this.isOpenFull = true;
		}
	}

	_animateControl() {

	}

	_onclickBtnAction() {
		const status = this._modal.dataset.visibilityStatus;
		if (status === "preview") {
			this.toggle("full");
		} else if (status === "full") {
			this.toggle("close");
		}
	}

	//? fonction nécessaire ?
	// close() {}

	_closePromise() {
		return new Promise((resolve, reject) => {
			const self = this;
			let transitionenHandler = function (event) {
				self._modal.removeEventListener(
					"transitionend",
					transitionenHandler
				);
				resolve();
			};
			self._modal.addEventListener("transitionend", transitionenHandler);
			self.toggle("close", "");
		});
	}

	_addContent(json) {
		const properties = json.properties;

		// Header
		const headerMarkup = this._createHeaderMarkup(properties);
		const modalHeader = this._modal.querySelector(
			".mp-Modal_HeaderContent"
		);

		// Body
		const bodyMarkup = this._createBodyMarkup(properties);
		const modalBody = this._modal.querySelector(".mp-Modal_Body");

		modalHeader.innerHTML = headerMarkup;
		modalBody.innerHTML = bodyMarkup;

		// Avant d'afficher, vérifer que les images sont bien chargées (via la lib imagesLoaded). Cela permet de calculer
		// une hauteur de preview (header) plus précise.
		imagesLoaded(this._modal, () => {
			const previewHeight = this._calcPreviewHeight();
			this.toggle("preview", previewHeight);
		});
	}

	_calcPreviewHeight() {
		let parentHeight = this._modal.offsetParent.offsetHeight;
		let bodyContent = this._modal.querySelector(".mp-Modal_Body");
		let padding = 24;
		let previewHeight = parentHeight - (bodyContent.offsetTop + padding);

		return previewHeight;
	}

	_createHeaderMarkup(json) {
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
	}

	_createBodyMarkup(json) {
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
