import { config } from "./config";
import { handleClickNav } from "./nav";

// Initialiser les scripts relatifs au site
export const init = () => {
    // Nav events
    const navTriggers = document.querySelectorAll(config.header.navTriggerHook);
    handleClickNav(navTriggers);

    // NavOverlay : animation des élements de liste à l'ouverture
    const navOverlay = document.querySelector(config.header.navOverlay);
    const navOverlayItems = navOverlay.querySelectorAll(
        "." + config.header.navOverlayItemsClass
    );
    navOverlayItems.forEach((item, index) => {
        item.style.transitionDelay = (index + 2) / 10 + "s";
    });

    // Animation des sections principales lors du chargement de la page
    const pageSections = document.querySelectorAll(
        config.sections.sectionsHook
    );
    const sectionClass = config.sections.sectionsStateClass;
    setTimeout(() => {
        for (let i = 0; i < pageSections.length; i++) {
            let section = pageSections[i];
            section.classList.add(sectionClass);
        }
    }, 800);
}
