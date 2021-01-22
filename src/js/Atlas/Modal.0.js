import { config } from "./config";

// TODO : repositionner le zoom de Leaflet

export class Modal {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.atlasContainer = container;
        this.settings = config.modal;
        this.dataModal = "data-" + this.settings.dataModal;
        this.memory = {};

        this.setTabIndex(this.settings.setTabIndex);
        this.setInitialState();

        this._handleClickClose = this.handleClickClose.bind(this);
        this._handleClickToggle = this.handleClickToggle.bind(this);
    }

    setInitialState() {
        const modals = this.atlasContainer.querySelectorAll(
            "[" + this.dataModal + "]"
        );
        if (modals) {
            modals.forEach((modal) => {
                // if (modal.classList.contains(this.settings.openedClass)) {
                //     //! TODO définir état actif
                // }
                modal.classList.remove(this.settings.openedClass);
                modal.classList.add(this.settings.closedClass);
                modal.setAttribute("aria-hidden", "true");
            });
        }
    }

    setTabIndex(bool) {
        const selector = "[" + this.dataModal + "]";
        if (selector) {
            const modals = this.atlasContainer.querySelectorAll(selector);
            modals.forEach((modal) => {
                if (bool) {
                    modal.setAttribute("tabindex", "-1");
                } else {
                    modal.removeAttribute("tabindex");
                }
            });
        }
    }

    async syncState(state) {
        // console.log("Modal syncState", state, this.state);
        if (state.modalAction === "openModal") {
            this.state = state;
            let modalId = state.modalId;
            let data = { openId: state.modalOpenId, args: state.modalArgs };
            let modals = this.atlasContainer.querySelectorAll(
                "[" + this.dataModal + "]"
            );

            // Fermer l'autre modal que celle demandée
            // qui serait éventuellement ouverte
            modals.forEach((modal) => {
                const id = modal.dataset.modal;
                if (id !== modalId && this.state[id] !== "closed") {
                    this.close(id);
                }
            });

            if (this.state[modalId] !== "closed") {
                await this.close(modalId);
                this.open(modalId, data);
            } else {
                this.open(modalId, data);
            }
            state.modalAction = "";
            state.modalOpenId = "";
            state.modalArgs = {};
        }

        // nouvelle valeur de searchboxHeight
        if (
            state.windowWidth === "desktop" &&
            state.windowWidth === this.state.windowWidth &&
            state.searchboxHeight !== this.state.searchoxHeight &&
            (this.state.modalAssociation === "openedFull" ||
                this.state.modalRecherche === "openedFull")
        ) {
            this.updateLayout(state.searchboxHeight);
        }

        // resize
        if (state.windowWidth !== this.state.windowWidth) {
            this.state = state; // prévenir une boucle infinie
            // console.log(this.state, this.memory);
            this.resizeModal(state.windowWidth);
        }
        this.state = state;
    }

    resizeModal(windowWidth) {
        let modalAssociation = this.getModal("modalAssociation");
        if (this.state.modalAssociation !== "closed") {
            if (this.state.modalAssociation === "openedFull") {
                // console.log("openedFull inchangée")
                this.updateLayout(0);
                this.setTransition(this.memory.settings, windowWidth);
                modalAssociation.style.transform = "translateY(0)";
            } else {
                // console.log("preview -> openedFull");
                // preview -> openedFull
                this.updateLayout(this.state.searchboxHeight);
                modalAssociation.style.transform = "translateX(0)";
                this.dispatch({ type: "updateModalPosition", modalAssociation: "openedFull" });
            }
        } else if (this.state.modalRecherche !== "closed") {
            // TODO
        }
    }

    getModal(modalId) {
        const selector = "[" + this.dataModal + "='" + modalId + "']";
        return this.atlasContainer.querySelector(selector);
    }

    // Si la fenêtre du navigateur est en position "desktop",
    // on ajoute une marge intérieure qui varie selon la hauteur
    // du module SearchBox.
    updateLayout(value) {
        const modals = this.atlasContainer.querySelectorAll(
            "[" + this.dataModal + "]"
        );
        modals.forEach((modal) => {
            let layout = modal.firstElementChild.firstElementChild;
            layout.style.paddingTop = value + "px";
        });
    }

    animBtn(button) {
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

    handleClickToggle(event) {
        const modal = event.target.closest("[" + this.dataModal + "]");
        const modalId = modal.dataset.modal;
        let action = {};
        action.type = "updateModalPosition";

        if (this.state[modalId] === "openedPreview") {
            modal.style.transform = "translateY(0)";

            this.memory.btnToggle.classList.remove("is-toggle-up");
            this.memory.btnToggle.classList.add("is-toggle-down");

            action[modalId] = "openedFull";
        } else {
            modal.style.transform = this.memory.settings.transitionOn;

            this.memory.btnToggle.classList.remove("is-toggle-down");
            this.memory.btnToggle.classList.add("is-toggle-up");

            action[modalId] = "openedPreview";
        }

        this.dispatch(action);
    }

    handleClickClose(event) {
        const modal = event.target.closest("[" + this.dataModal + "]");
        this.close(modal.dataset.modal);
    }

    open(modalId, data) {
        console.log("open", modalId);
        this.memory[modalId] = {};

        let args, history;
        if (data.openId) {
            args = { id_gis: data.openId };
            history = true;
        } else {
            args = { id_association: data.args.id_association };
            history = false;
        }
        // tmpMemory.args = args;
        // tmpMemory.history = history;
        this.memory[modalId].args = args;
        this.memory[modalId].history = history;

        let cb = () => {
            this.handleOpen(modalId);
            console.log(this.memory);
        };

        window.ajaxReload(modalId, {
            callback: cb,
            args: args,
            history: history,
        });
    }

    async close(modalId) {
        let modal = this.getModal(modalId);
        await this.closeTransition(modal, this.memory[modalId].settings);

        // Retirer les gestionnaires
        this.unbindListeners(modal);

        let action = {};
        action.type = "updateModalPosition";
        action.modalId = modalId;
        action[modalId] = "closed";
        this.dispatch(action);
    }

    async handleOpen(modalId) {
        let modal = this.getModal(modalId);
        this.memory[modalId].settings = {};

        // Gestionnaires d'événements
        this.bindListeners(modal);

        // Définir les variables supplémentaires suivantes :
        // - position
        // - transitionOn / transitionOff
        let settings = this.memory[modalId].settings;

        if (this.state.windowWidth === "desktop") {
            this.updateLayout(this.state.searchboxHeight);
            settings.position = "openedFull";
            // translation depuis la gauche de la fenêtre
            this.setTransition(settings, "desktop");
        } else {
            settings.position = "openedPreview";
            settings.height = this.calcPreviewHeight(modal) + "px";
            // translation depuis le bas de la fenêtre
            this.setTransition(settings, this.state.windowWidth);
        }

        // Transition
        await this.openTransition(modal, settings);
        this.memory[modalId].btnClose.classList.add("is-ready-to-animate");
        this.memory[modalId].btnToggle.classList.add("is-ready-to-animate");
        if (settings.position === "openedPreview") {
            this.memory[modalId].btnToggle.classList.add("is-toggle-up");
        } else {
            this.memory[modalId].btnToggle.classList.add("is-toggle-down");
        }

        let action = {};
        action.type = "updateModalPosition";
        action.modalId = modalId;
        action[modalId] = this.memory[modalId].settings.position;
        this.dispatch(action);
    }

    openTransition(el, settings) {
        return new Promise((resolve) => {
            el.setAttribute("aria-hidden", "false");
            el.addEventListener("transitionend", function _f() {
                resolve(el);
                this.removeEventListener("transitionend", _f);
            });
            el.style.transform = settings.transitionOn;
        });
    }

    closeTransition(el, settings) {
        return new Promise((resolve) => {
            el.addEventListener("transitionend", function _f() {
                el.setAttribute("aria-hidden", "true");
                resolve(el);
                this.removeEventListener("transitionend", _f);
            });
            el.style.transform = settings.transitionOff;
        });
    }

    bindListeners(modal) {
        let index;
        let btns = modal.querySelectorAll("." + this.settings.btnClassName);
        let modalId = modal.dataset.modal;
        this.memory[modalId].btns = btns;

        for (index = 0; index < btns.length; index++) {
            const btn = btns[index];
            this.animBtn(btn);
            btn.setAttribute("tabindex", "0");
            if (btn.id === "ModalToggle") {
                this.memory[modalId].btnToggle = btn;
            }
            if (btn.id === "ModalClose") {
                this.memory[modalId].btnClose = btn;
            }
        }

        this.memory[modalId].btnToggle.addEventListener(
            "click",
            this._handleClickToggle
        );
        this.memory[modalId].btnClose.addEventListener("click", this._handleClickClose);
    }

    unbindListeners(modal) {
        let modalId = modal.dataset.modal;
        this.memory[modalId].btnToggle.removeEventListener(
            "click",
            this._handleClickToggle
        );
        this.memory[modalId].btnClose.removeEventListener(
            "click",
            this._handleClickClose
        );
        for (let index = 0; index < this.memory[modalId].btns.length; index++) {
            const btn = this.memory[modalId].btns[index];
            btn.setAttribute("tabindex", "-1");
        }
        //this.memory = {};
    }

    calcPreviewHeight(modal) {
        const body = modal.querySelector("." + this.settings.bodyClassName);
        const MapHeight = modal.parentElement.offsetHeight;
        const previewHeight = MapHeight - (body.offsetTop + 36);
        return previewHeight;
    }

    setTransition(settings, windowWidth) {
        if (windowWidth === "desktop") {
            settings.transitionOn = "translateX(0)";
            settings.transitionOff = "translateX(-100%)";
        } else {
            settings.transitionOn = "translateY(" + settings.height + ")";
            settings.transitionOff = "translateY(100%)";
        }
        return settings;
    }
}
