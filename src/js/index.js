import { config } from "./ataConfig";
import { navState } from "./components/navState";

document.addEventListener("DOMContentLoaded", function () {

	// Nav_Trigger : handle click event
	// ==================================
	let navTriggers = document.querySelectorAll(config.header.navTriggerHook);
	let total = navTriggers.length;
	for (let i = 0; i < total; i++) {
		const navTrigger = navTriggers[i];
		const navTriggerStateClass = config.header.navTriggerStateClass;
		// Identifier l'autre bouton (sur un total de 2)
		// afin de gérer son état également lors du clic
		let i_alt = (i + 1) % total;
		navTrigger.addEventListener(
			"click",
			() => {
				let open = navState();
				if (open) {
					navTrigger.classList.add(navTriggerStateClass);
					navTriggers[i_alt].classList.add(navTriggerStateClass);
				} else {
					navTrigger.classList.remove(navTriggerStateClass);
					navTriggers[i_alt].classList.remove(navTriggerStateClass);
				}
			},
			false
		);
	}

	// Animation sections (header, main and footer)
	// ================================================
	const pageSections = document.querySelectorAll(
		config.sections.sectionsHook
	);
	const sectionClass = config.sections.sectionsStateClass;

	setTimeout(() => {
		for (let i = 0; i < pageSections.length; i++) {
			const section = pageSections[i];
			section.classList.add(sectionClass);
		}
	}, 800);

});
