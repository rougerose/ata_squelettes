"use strict";

var Ata = Ata || {};

Ata = (function () {
	function init() {
		// Nav: gérer le clic sur le bouton Menu
		// -------------------------------------------
		let navTriggersEls = document.querySelectorAll(
			Ata.config.header.navTriggerHook
		);
		Ata.nav.handleTriggerClick(navTriggersEls);

		// Animer les sections principales de la page
		// -------------------------------------------
		let pageSectionsEls = document.querySelectorAll(
			Ata.config.sections.sectionsHook
		);
		Ata.sections.animatePageSections(pageSectionsEls);
	}

	return {
		init: init,
	};
})();
