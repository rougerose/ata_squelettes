import { config } from "./config";

export class Modal {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.atlasContainer = container;
        this.modals = {};
        this.memory = {
            modalAssociation: {
                position: "",
                btns: [],
                transitions: {
                    transitionOn: "",
                    transitionOnPreview: "",
                    transitionOff: "",
                },
            },
            modalRecherche: {
                position: "",
                btns: [],
                transitions: {
                    transitionOn: "",
                    transitionOnPreview: null,
                    transitionOff: "",
                },
            },
            previewHeight: "",
            bottomBarHeight: "",
            working: false,
        };

        this.setUpModal();
        this._handlerClickBtns = this.handlerClickBtns.bind(this);
        this._handlerClickList = this.handlerClickList.bind(this);
    }

    syncState(state) {
        if (state.modalAction === "addModalContent") {
            this.addContent(state);
        } else if (state.modalAction === "closeModals") {
            this.closeAllModals();
        } else if (
            state.windowWidth === "desktop" &&
            state.windowWidth === this.state.windowWidth &&
            state.searchboxHeight !== this.state.searchoxHeight &&
            (this.state.modalAssociation === "openedFull" ||
                this.state.modalRecherche === "openedFull")
        ) {
            this.updateLayout(state.searchboxHeight);
        }

        this.state = state;
    }

    async addContent(state) {
        let modalId = state.modalId;
        let args, history;

        if (state.modalOpenId) {
            args = { id_gis: state.modalOpenId };
            history = true;
        } else if (state.modalArgs) {
            args = { id_association: state.modalArgs.id_association };
            history = false;
            console.log(state.modalArgs.id_association);
        }

        /* Fermer la modale si elle est déjà ouverte */
        if (this.memory[modalId].position !== "closed") {
            await this.close(modalId, true);
        }

        if (modalId === "modalRecherche" && this.memory.modalAssociation.position !== "closed") {
            await this.close("modalAssociation", true);
        }

        /* Charger le contenu via ajaxReload et ouvrir via le callback */
        const openCallback = () => {
            /* Memoriser le nouveau contenu */
            const modal = this.atlasContainer.querySelector("#" + modalId);
            this.modals[modalId] = modal;

            /* Ajouter les gestionnaires d'événements */
            this.bindListeners(modalId);

            /* Position et transitions */
            this.setPosition(modalId);

            if (
                modalId === "modalRecherche" &&
                this.state.windowWidth === "mobile"
            ) {
                // Ouvrir seulement la barre en bas de fenêtre
                this.toggleVisibility(modalId);
            } else {
                // Ouvrir la modale
                this.open(modalId, true);
            }
        };

        window.ajaxReload(modalId, {
            callback: openCallback,
            args: args,
            history: history,
        });
    }

    closeAllModals() {
        this.memory.working = true;
        for (const key in this.modals) {
            const modalId = this.modals[key].id;
            if (this.memory[modalId].position !== "closed") {
                this.close(modalId, true);
            }
        }
        if (this.state.windowWidth === "mobile") {
            this.memory.bottomBarHeight = "";
            this.dispatch({
                type: "moveZoom",
                height: 0,
            });
        }
        this.memory.working = false;
    }

    async close(modalId, bool) {
        let modal = this.modals[modalId];
        let toggleAria = typeof bool === "undefined" ? true : bool;
        let moveZoom;

        if (
            !toggleAria &&
            modalId === "modalRecherche" &&
            this.state.windowWidth === "mobile"
        ) {
            modal = modal.firstElementChild.firstElementChild;
            toggleAria = false;
        }

        this.memory.working = true;

        await this.closeTransition(
            modal,
            this.memory[modalId].transitions.transitionOff,
            toggleAria
        );

        if (toggleAria) {
            this.memory[modalId].position = "closed";
            this.unbindListeners(modalId);

            if (this.state.windowWidth === "mobile" && this.memory.modalRecherche.position === "closed") {
                this.dispatch({
                    type: "moveZoom",
                    height: 0,
                });
            }
        } else {
            this.memory[modalId].position = "visible";
        }

        this.memory.working = false;

        return modal;
    }

    async open(modalId, bool) {
        let modal = this.modals[modalId];
        let toggleAria = typeof bool === "undefined" ? true : bool;
        let transition, btnToggleClass, moveZoom;

        // Selon la modale et la largeur de la fenêtre, le bloc à manipuler n'est pas le même.
        if (
            modalId === "modalRecherche" &&
            this.state.windowWidth === "mobile"
        ) {
            modal = modal.firstElementChild.firstElementChild;
            toggleAria = false;
            moveZoom = this.memory.bottomBarHeight;
        }

        if (this.memory[modalId].position === "openedPreview") {
            transition = this.memory[modalId].transitions.transitionOnPreview;
            btnToggleClass = "is-toggle-up";
            if (this.memory.modalRecherche.position === "closed") {
                moveZoom = this.memory.previewHeight;
            }
        } else {
            transition = this.memory[modalId].transitions.transitionOn;
            btnToggleClass = "is-toggle-down";
        }

        this.memory.working = true;

        await this.openTransition(modal, transition, toggleAria);

        this.memory[modalId].btns.forEach((btn) => {
            btn.classList.add("is-ready-to-animate");
            if (btn.dataset.modalAction === "toggle") {
                btn.classList.add(btnToggleClass);
            }
        });

        if (typeof moveZoom !== "undefined") {
            this.dispatch({
                type: "moveZoom",
                height: moveZoom,
            });
        }

        this.memory.working = false;

        return modal;
    }

    toggleVisibility(modalId) {
        const modal = this.modals[modalId];

        if (modal.getAttribute("aria-hidden") === "false") {
            modal.setAttribute("aria-hidden", "true");
            this.memory[modalId].position = "closed";
        } else {
            modal.setAttribute("aria-hidden", "false");
            this.memory[modalId].position = "visible";
            this.dispatch({ type: "moveZoom", height: this.memory.bottomBarHeight });
        }
    }

    bindListeners(modalId) {
        const modal = this.modals[modalId];
        const btns = modal.querySelectorAll("button");
        this.memory[modalId].btns = btns;

        btns.forEach((btn) => {
            btn.addEventListener("click", this._handlerClickBtns);
            btn.setAttribute("tabindex", "0");

            if (modalId === "modalAssociation") {
                this.setAnimationBtn(btn);
            }
        });

        if (modalId === "modalRecherche") {
            const list = modal.querySelectorAll("li");
            this.memory[modalId].list = list;
            list.forEach((item) => {
                item.addEventListener("click", this._handlerClickList);
            });
        }
    }

    unbindListeners(modalId) {
        const btns = this.memory[modalId].btns;
        btns.forEach((btn) => {
            btn.removeEventListener("click", this._handlerClickBtns);
            btn.setAttribute("tabindex", "-1");
        });

        const list = this.memory[modalId].list;
        if (typeof list !== "undefined" && list.length > 0) {
            list.forEach((item) => {
                item.removeEventListener("click", this._handlerClickList);
            });
        }
    }

    ///\\\
    calcBottomBarHeight(modal) {
        const bottomBar = modal.querySelector("." + config.modal.bottomBarClass);
        return -Math.abs(bottomBar.offsetHeight);
    }

    calcPreviewHeight(modal) {
        const body = modal.querySelector("article h2");
        const previewHeight = -Math.abs(body.nextElementSibling.offsetTop + 36);
        return previewHeight;
    }

    getModals() {
        const modals = this.atlasContainer.querySelectorAll("[data-modal]");
        return modals;
    }

    handlerClickBtns(event) {
        const btn = event.target;
        const modal = event.target.closest("[data-modal]");
        const modalId = modal.id;
        const action = event.target.dataset.modalAction;
        // position demandée
        const position = this.memory[modalId].position;

        if (modal.id === "modalRecherche" && action === "toggle") {
            if (this.memory.working) {
                return;
            }

            // Manipuler le texte du bouton
            if (btn.getAttribute("data-text-toggle") == btn.innerHTML) {
                btn.innerHTML = btn.getAttribute("data-text-original");
            } else {
                btn.setAttribute("data-text-original", btn.innerHTML);
                btn.innerHTML = btn.getAttribute("data-text-toggle");
            }

            // Si position "visible", alors seule la barre en bas de la fenêtre est visible.
            // sinon position "openedFull".
            if (position === "visible") {
                this.memory[modalId].position = "openedFull";
                this.open(modalId, false);
            } else {
                this.memory[modalId].position = "visible";
                this.close(modalId, false);
            }
        } else if (modal.id === "modalAssociation") {
            if (this.memory.working) {
                return;
            }

            if (action === "toggle" && position === "openedPreview") {
                this.memory[modalId].position = "openedFull";
                this.open(modalId, false);
            } else {
                this.close(modalId, true);
            }
        }
    }

    handlerClickList(event) {
        const li = event.target.closest("[data-id-gis]");
        if (li) {
            this.dispatch({
                type: "addModalContent",
                openId: li.dataset.idGis,
                modalId: "modalAssociation",
            });
            this.dispatch({
                type: "centerOnMarker",
                coords: [li.dataset.lon, li.dataset.lat],
                id: li.dataset.idGis,
            });
        }
    }

    openTransition(el, transition, bool) {
        return new Promise((resolve) => {
            if (bool) {
                el.setAttribute("aria-hidden", "false");
            }
            el.addEventListener("transitionend", function _f() {
                resolve(el);
                this.removeEventListener("transitionend", _f);
            });
            el.style.transform = transition;
        });
    }

    closeTransition(el, transition, bool) {
        return new Promise((resolve) => {
            el.addEventListener("transitionend", function _f() {
                if (bool) {
                    el.setAttribute("aria-hidden", "true");
                }
                el.style.transform = "";
                resolve(el);
                this.removeEventListener("transitionend", _f);
            });
            el.style.transform = transition;
        });
    }

    setAnimationBtn(button) {
        const circle = button.querySelector("circle");
        if (circle) {
            const circumference = (
                2 *
                Math.PI *
                circle.getAttribute("r")
            ).toFixed(2);
            circle.setAttribute("stroke-dashoffset", circumference);
            circle.setAttribute("stroke-dasharray", circumference);
        }
    }

    /*
        Définir position et transitions en fonction de la modale à ouvrir
        et en fonction de la largeur de la fenêtre.
     */
    setPosition(modalId) {
        const modal = this.modals[modalId];
        let position, transitions;
        if (this.state.windowWidth === "desktop") {
            this.updateLayout(this.state.searchboxHeight);
            position = "openedFull";
            transitions = this.setStyleTransitions(this.state.windowWidth);
        } else {
            if (modalId === "modalAssociation") {
                position = "openedPreview";
                this.memory.previewHeight = this.calcPreviewHeight(modal);
                transitions = this.setStyleTransitions(this.state.windowWidth);
            } else {
                position = "openedFull";
                transitions = this.setStyleTransitions(this.state.windowWidth);
                this.memory.bottomBarHeight = this.calcBottomBarHeight(modal);
            }
        }

        this.memory[modalId].position = position;
        this.memory[modalId].transitions = transitions;
    }

    setStyleTransitions(windowWidth) {
        let transitions = {};
        if (windowWidth === "desktop") {
            transitions.transitionOn = "translateX(0)";
            transitions.transitionOnPreview = null;
            transitions.transitionOff = "translateX(-100%)";
        } else {
            if (this.memory.previewHeight) {
                transitions.transitionOnPreview =
                    "translateY(" + this.memory.previewHeight + "px)";
            } else {
                transitions.transitionOnPreview = null;
            }
            transitions.transitionOn = "translateY(-100%)";
            transitions.transitionOff = "translateY(0)";
        }
        return transitions;
    }

    setTabIndex(el, bool) {
        if (bool) {
            el.setAttribute("tabindex", "-1");
        } else {
            el.removeAttribute("tabindex");
        }
    }

    setUpModal() {
        const modals = this.getModals();

        if (modals) {
            modals.forEach((modal) => {
                const modalId = modal.id;
                this.modals[modalId] = modal;
                if (modal.classList.contains(config.modal.openedClass)) {
                    // TODO prendre en compte un état ouvert si id_gis est présent dans l'url.
                } else {
                    modal.setAttribute("aria-hidden", "true");
                    // modal.classList.add(config.modal.closedClass);
                    this.setTabIndex(modal, true);
                    this.memory[modalId].position = "closed";
                }
            });
        }
    }

    /*
    Si la fenêtre du navigateur est en position "desktop",
    on ajoute une marge intérieure qui varie selon la hauteur
    du module Searchbox.
    */
    updateLayout(value) {
        for (const key in this.modals) {
            let innerDiv = this.modals[key].firstElementChild.firstElementChild;
            innerDiv.style.paddingTop = value + "px";
        }
    }
}
