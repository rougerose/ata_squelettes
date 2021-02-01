import { config } from "./config";

// Nav_Trigger : click event
// ==================================
export const handleClickNav = (nodeList) => {
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
