import { config } from "./config";

// Animation des sections (header, main and footer)
// ================================================
export let pageInit = () => {
	let pageSections = document.querySelectorAll(config.sections.sectionsHook);
	let sectionClass = config.sections.sectionsStateClass;
	setTimeout(() => {
		for (let i = 0; i < pageSections.length; i++) {
			let section = pageSections[i];
			section.classList.add(sectionClass);
		}
	}, 800);
};
