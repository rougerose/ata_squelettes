import { config } from "./ataConfig";
import { navTriggerHandlerEvent } from "./components/nav";

document.addEventListener("DOMContentLoaded", function () {
	// Nav_Trigger : click event
	// ==================================
	const navTriggers = document.querySelectorAll(config.header.navTriggerHook);
	navTriggerHandlerEvent(navTriggers);

	// Animation des sections (header, main and footer)
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

function ataMap(selector) {
	let el = document.querySelector(selector);
	console.log(el);
	// return el;
}

export default ataMap
