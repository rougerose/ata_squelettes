import { Map } from "./Map/index";

const init = (mapObj) => {
	const map = new Map(mapObj);
	map.setupZoom();
	map.loadJson();
}

export { init };
