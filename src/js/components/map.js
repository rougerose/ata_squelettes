import { setupSearchBox, autocomplete_callback } from "./map-searchbox";


export const setupMap = (map) => {
	setupControlZoom(map);
	setupSearchBox(map);
}

export { autocomplete_callback }


function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomleft" }).addTo(mapObj);
}
