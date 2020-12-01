import { navInit } from "./components/nav";
import { pageInit } from "./components/page";
import { mapInit } from "./map/index";
import { autocomplete_callback } from "./map/searchBox";

// Initialiser les scripts relatifs au site
export const init = () => {
	navInit();
	pageInit();
}

// Initialiser le module relatif à l'atlas
export const map = (mapObj) => {
	mapInit(mapObj);
}

export const ac_callback = (event, ui) => {
	autocomplete_callback(event, ui);
}
