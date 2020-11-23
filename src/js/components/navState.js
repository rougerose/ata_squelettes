import { config } from "../ataConfig";

export let navState = () => {
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
