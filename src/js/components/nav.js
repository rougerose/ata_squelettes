import { config } from "../ataConfig";


const handleClickEvent = (nodeList) => {
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
}

let navState = () => {
	let body = document.body;
	let state;
	let navStateClass = config.header.navStateClass;

	if (body.classList.contains(navStateClass)) {
		body.classList.remove(navStateClass);
		state = false;
	} else {
		body.classList.add(navStateClass);
		state = true;
	}

	return state;
};

export { handleClickEvent as navTriggerHandlerEvent };
