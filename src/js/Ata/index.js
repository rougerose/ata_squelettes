import { navInit } from "./components/nav";
import { pageInit } from "./components/page";

// Initialiser les scripts relatifs au site
export const init = () => {
	navInit();
	pageInit();
}
