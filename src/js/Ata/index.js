import { navInit } from "./components/nav";
import { pageInit } from "./components/page";
// import { mapInit } from "./map/index";
// import { addKeyword } from "./map/keywords";


// Initialiser les scripts relatifs au site
export const init = () => {
	navInit();
	pageInit();
}

// Initialiser le module relatif à l'atlas
// export const map = (mapObj) => {
// 	mapInit(mapObj);
// }

// export { addKeyword };
