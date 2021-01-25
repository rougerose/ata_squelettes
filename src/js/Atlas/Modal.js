import { config } from "./config";

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

// TODO : repositionner le zoom de Leaflet en mode Preview

export class Modal {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.atlasContainer = container;
        this.modals = {};
        this.memory = {
            // openedModals: [],
            // closedModals: [],
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
            working: false,
        };

        this.setUpModal();
        this._handlerClick = this.handlerClick.bind(this);
        // this._handleCloseBtn = this.handleCloseBtn.bind(this);
        // this._handleToggleBtn = this.handleToggleBtn.bind(this);
    }

    syncState(state) {
        if (state.modalAction === "addModalContent") {
            this.state = state;
            this.addContent(state);
        } else if (state.modalAction === "closeModals") {
            this.state = state;
            this.closeAllModals();
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
        }

        /* Fermer la modale si elle est déjà ouverte */
        if (this.memory[modalId].position !== "closed") {
            await this.close(modalId, true);
            this.unbindListeners(modalId);
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

            if (modalId === "modalRecherche" && this.state.windowWidth === "mobile") {
                this.toggleVisibility(modalId);
            } else {
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
        for (const key in this.modals) {
            const modalId = this.modals[key].id;
            if (this.memory[modalId].position !== "closed") {
                this.close(modalId, true);
            }
        }
    }

    async close(modalId, bool) {
        let modal = this.modals[modalId];
        let toggleAria = typeof bool === "undefined" ? true : bool;

        if (!toggleAria && modalId === "modalRecherche" && this.state.windowWidth === "mobile") {
            modal = modal.firstElementChild.firstElementChild;
            toggleAria = false;
        }

        this.memory.working = true;
        await this.closeTransition(
            modal,
            this.memory[modalId].transitions.transitionOff,
            toggleAria
        );
        this.memory.working = false;
        if (toggleAria) {
            this.memory[modalId].position = "closed";
        } else {
            this.memory[modalId].position = "visible";
        }
    }

    async open(modalId, bool) {
        let modal = this.modals[modalId];
        let transition;
        let toggleAria = typeof bool === "undefined" ? true : bool;

        // Selon la modale et la largeur de la fenêtre, le bloc à manipuler n'est pas le même.
        if (modalId === "modalRecherche" && this.state.windowWidth === "mobile") {
            modal = modal.firstElementChild.firstElementChild;
            toggleAria = false;
        }

        if (this.memory[modalId].position === "openedPreview") {
            transition = this.memory[modalId].transitions.transitionOnPreview;
        } else {
            transition = this.memory[modalId].transitions.transitionOn;
        }

        this.memory.working = true;
        await this.openTransition(modal, transition, toggleAria);
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
        }
    }

    // async handleOpenModal(modalId, position) {
    //     // Ajouter les gestionnaires d'événements
    //     const modal = this.atlasContainer.querySelector("#" + modalId);
    //     this.bindListeners(modal);

    //     // ouvrir
    //     let r = await this.openTransition(modal, position);
    //     console.log(r);
    //     // animation des boutons d'action

    //     // dispatch open

    //     // et update memory
    //     this.memory.openedModals.push(modalId);
    //     let closedModals = this.memory.closedModals;
    //     if (closedModals.length > 0) {
    //         this.memory.closedModals = arrayRemove(closedModals, modalId);
    //     }
    // }

    bindListeners(modalId) {
        const modal = this.modals[modalId];
        const btns = modal.querySelectorAll("button");
        this.memory[modalId].btns = btns;

        btns.forEach((btn) => {
            btn.addEventListener("click", this._handlerClick);
            btn.setAttribute("tabindex", "0");
        });

        // if (modalId === "modalAssociation") {
        //     btns.forEach((btn) => {
        //         this.setAnimationBtn(btn);
        //         btn.setAttribute("tabindex", "0");
        //         if (btn.id === "ModalToggle") {
        //             btn.addEventListener("click", this._handleToggleBtn);
        //         }
        //         if (btn.id === "ModalClose") {
        //             btn.addEventListener("click", this._handleCloseBtn);
        //         }
        //     });
        // } else {
        //     btns[0].addEventListener("click", this._handleToggleBtn);
        // }
    }

    unbindListeners(modalId) {
        const btns = this.memory[modalId].btns;
        btns.forEach((btn) => {
            btn.removeEventListener("click", this._handlerClick);
            btn.setAttribute("tabindex", "-1");
        });
    }

    ///\\\

    calcPreviewHeight(modal) {
        const body = modal.querySelector("." + config.modal.bodyClassName);
        const previewHeight =
            modal.parentElement.offsetHeight - (body.offsetTop + 36);
        return previewHeight;
    }

    getModals() {
        const modals = this.atlasContainer.querySelectorAll("[data-modal]");
        return modals;
    }

    handlerClick(event) {
        const modal = event.target.closest("[data-modal]");
        const modalId = modal.id;
        const action = event.target.dataset.modalAction;
        // position demandée
        const position = this.memory[modalId].position;

        if (modal.id === "modalRecherche" && action === "toggle") {
            if (this.memory.working) {
                return;
            }
            // position "visible" = seule la barre est visible.
            // sinon position "openedFull".
            if (position === "visible") {
                this.memory[modalId].position = "openedFull";
                this.open(modalId, false);
            } else {
                this.memory[modalId].position = "visible";
                this.close(modalId, false);
            }
            // if (position === "closed") {
            //     // this.open(modalId);
            // } else {
            //     this.close(modalId);
            // }
        }
    }

    // handleCloseBtn(event) {
    //     const modalId = event.target.id;
    //     this.close(modalId);
    // }

    // handleToggleBtn(event) {
    //     const btn = event.target;
    //     const modal = btn.closest("[data-modal]");
    //     const modalId = modal.id;
    //     let action = { type: "updateModalPosition" };

    //     if (modalId === "modalRecherche") {
    //         let position = this.memory.modalRecherche.position;

    //         if (position === "openedFull") {
    //             this.close(modalId, false);
    //         } else {
    //             // Enregistrer la position demandée
    //             // this.handleOpenModal(modalId, "openedFull");
    //         }
    //     }
    // }

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
        } else if (
            modalId === "modalAssociation" &&
            this.state.windowWidth === "mobile"
        ) {
            position = "openedPreview";
            this.memory.previewHeight = this.calcPreviewHeight(modal);
            transitions = this.setStyleTransitions(this.state.windowWidth);
        } else {
            position = "openedFull";
            transitions = this.setStyleTransitions(this.state.windowWidth);
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
                    modal.classList.add(config.modal.closedClass);
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
