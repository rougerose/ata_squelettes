// Ata.nav = Ata.nav || {};
Ata.nav = (function () {
	let handleTriggerClick = (navTriggersEls) => {
		let total = navTriggersEls.length;
		for (let i = 0; i < total; i++) {
			const navTriggerEl = navTriggersEls[i];
			const navTriggerStateClass = Ata.config.header.navTriggerStateClass;
			// Identifier l'autre bouton (sur un total de 2)
			// afin de gérer son état également lors du clic
			let i_alt = (i + 1) % total;
			navTriggerEl.addEventListener(
				"click",
				() => {
					let open = navState();
					if (open) {
						navTriggerEl.classList.add(navTriggerStateClass);
						navTriggersEls[i_alt].classList.add(
							navTriggerStateClass
						);
					} else {
						navTriggerEl.classList.remove(navTriggerStateClass);
						navTriggersEls[i_alt].classList.remove(
							navTriggerStateClass
						);
					}
				},
				false
			);
		}
	};
	let navState = () => {
		let body = document.body;
		let state;
		let navStateClass = Ata.config.header.navStateClass;

		if (body.classList.contains(navStateClass)) {
			body.classList.remove(navStateClass);
			state = false;
		} else {
			body.classList.add(navStateClass);
			state = true;
		}

		return state;
	};
	return {
		handleTriggerClick: handleTriggerClick,
	};
})();
/*
Ata.nav = (function () {
	function init() { }

	let handleTriggerClick = (navTriggersEls) => {
		let total = navTriggersEls.length;
		for (let i = 0; i < total; i++) {
			const navTriggerEl = navTriggersEls[i];
			const navTriggerStateClass = Ata.config.header.navTriggerStateClass;
			// Identifier l'autre bouton (sur un total de 2)
			// afin de gérer son état également lors du clic
			let i_alt = (i + 1) % total;
			navTriggerEl.addEventListener(
				"click",
				() => {
					let open = navState();
					if (open) {
						navTriggerEl.classList.add(navTriggerStateClass);
						navTriggersEls[i_alt].classList.add(
							navTriggerStateClass
						);
					} else {
						navTriggerEl.classList.remove(navTriggerStateClass);
						navTriggersEls[i_alt].classList.remove(
							navTriggerStateClass
						);
					}
				},
				false
			);
		}
	}

	// Nav_Trigger : handle click event
	// ==================================
	let navTriggersEls = document.querySelectorAll(Ata.config.header.navTriggerHook);
	let total = navTriggersEls.length;
	for (let i = 0; i < total; i++) {
		const navTriggerEl = navTriggersEls[i];
		const navTriggerStateClass = Ata.config.header.navTriggerStateClass;
		// Identifier l'autre bouton (sur un total de 2)
		// afin de gérer son état également lors du clic
		let i_alt = (i + 1) % total;
		navTriggerEl.addEventListener(
			"click",
			() => {
				let open = navState();
				if (open) {
					navTriggerEl.classList.add(navTriggerStateClass);
					navTriggersEls[i_alt].classList.add(navTriggerStateClass);
				} else {
					navTriggerEl.classList.remove(navTriggerStateClass);
					navTriggersEls[i_alt].classList.remove(
						navTriggerStateClass
					);
				}
			},
			false
		);
	}

	// Animation sections (header, main and footer)
	// ================================================
	const pageSectionsEls = document.querySelectorAll(
		Ata.config.sections.sectionsHook
	);
	const sectionClass = Ata.config.sections.sectionsStateClass;

	setTimeout(() => {
		for (let i = 0; i < pageSectionsEls.length; i++) {
			const sectionEl = pageSectionsEls[i];
			sectionEl.classList.add(sectionClass);
		}
	}, 800);

	return {
		init: init,
		navTriggerClick: navTriggerClick,
	};

})();
*/
