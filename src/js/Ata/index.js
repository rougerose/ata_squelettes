import { config } from "./config";
import { handleClickNav } from "./nav";

// Initialiser les scripts relatifs au site
export const init = () => {
    // Nav events
    const navTriggers = document.querySelectorAll(config.header.navTriggerHook); handleClickNav(navTriggers);

    // Animation, lors du chargement de la page, des sections principales
    const pageSections = document.querySelectorAll(config.sections.sectionsHook);
    const sectionClass = config.sections.sectionsStateClass;
    setTimeout(() => {
        for (let i = 0; i < pageSections.length; i++) {
            let section = pageSections[i];
            section.classList.add(sectionClass);
        }
    }, 800);
}
