import { setupSearchBox } from "./map-searchbox";


export let setupMap = (map) => {
	setupControlZoom(map);
	setupSearchBox(map);
}


function setupControlZoom(mapObj) {
	L.control.zoom({ position: "bottomleft" }).addTo(mapObj);
}
