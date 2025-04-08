var Ata = (function (exports) {
    'use strict';

    const config = {
        sections: {
            sectionsHook: "[data-section]",
            sectionsStateClass: "is-visible",
        },
        header: {
            navTriggerHook: ".hamburger",
            navTriggerStateClass: "is-active",
            navStateClass: "nav-is-open",
            navOverlay: "nav.st-NavOverlay",
            navOverlayItemsClass: "st-NavOverlay_Item",
        },
    };

    // Nav_Trigger : click event
    // ==================================
    const handleClickNav = (nodeList) => {
    	let total = nodeList.length;
    	for (let i = 0; i < total; i++) {
    		const trigger = nodeList[i];
    		const triggerStateClass = config.header.navTriggerStateClass;
    		// Identifier l'autre bouton (sur un total de 2)
    		// afin de gérer son état également lors du clic
    		let i_alt = (i + 1) % total;
    		trigger.addEventListener(
    			"click",
    			() => {
    				let open = navState();
    				if (open) {
    					trigger.classList.add(triggerStateClass);
    					nodeList[i_alt].classList.add(triggerStateClass);
    				} else {
    					trigger.classList.remove(triggerStateClass);
    					nodeList[i_alt].classList.remove(triggerStateClass);
    				}
    			},
    			false
    		);
    	}
    };

    const navState = () => {
    	const body = document.body;
    	const navStateClass = config.header.navStateClass;
    	let state;

    	if (body.classList.contains(navStateClass)) {
    		body.classList.remove(navStateClass);
    		state = false;
    	} else {
    		body.classList.add(navStateClass);
    		state = true;
    	}

    	return state;
    };

    // Initialiser les scripts relatifs au site
    const init = () => {
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
        }, 500);
    };

    exports.init = init;

    return exports;

})({});
