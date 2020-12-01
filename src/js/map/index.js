import { setupSearchBox } from "./searchBox";

export let mapInit = (mapObj) => {
	setupControlZoom(mapObj);
	// Initialiser la recherche
	setupSearchBox();
}

// Position des boutons de zoom sur la carte
function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomleft" }).addTo(mapObj);
}
