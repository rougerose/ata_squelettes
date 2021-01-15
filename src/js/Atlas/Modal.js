import { config } from "./config";

// TODO : repositionner le zoom de Leaflet

export class Modal {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.settings = config.modal;
        this.memory = {};

        let modal = this.getModal(this.settings.containerId);
        modal.setAttribute("aria-hidden", "true");

        this._handleClickClose = this.handleClickClose.bind(this);
        this._handleClickToggle = this.handleClickToggle.bind(this);
        // this._handleCancel = this._handleCancel.bind(this);
    }

    async syncState(state) {
        console.log(state);
        if (state.modal.action) {
            if (
                state.modal.action === "open" &&
                this.state.modal.position !== "closed"
            ) {
                console.log("close");
                await this.close();
                this.open(state.modal.openId);
            } else if (state.modal.action === "open") {
                console.log("open");
                this.open(state.modal.openId);
            }
        } else if (
            state.windowWidth === "desktop" &&
            this.state.modal.position === "openedFull" &&
            state.searchboxHeight !== this.state.searchboxHeight
        ) {
            console.log("update", state);
            this.updateLayout(state.searchboxHeight);
        }
        this.state = state;
    }

    getModal() {
        let id = this.settings.containerId;
        return document.getElementById(id);
    }

    // Si la fenêtre du navigateur est en position "desktop",
    // on ajoute une marge intérieure qui varie selon la hauteur
    // du module SearchBox.
    updateLayout(value) {
        let modal = this.getModal();
        let layout = modal.firstElementChild.firstElementChild;
        layout.style.paddingTop = value + "px";
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

    handleClickToggle() {
        let modal = this.getModal();
        if (this.state.modal.position === "openedPreview") {
            modal.style.transform = "translateY(0)";
            this.memory.btnToggle.classList.remove("is-toggle-up");
            this.memory.btnToggle.classList.add("is-toggle-down");
            this.dispatch({
                type: "updateModalPosition",
                position: "openedFull",
            });
        } else {
            modal.style.transform = this.memory.settings.transitionOn;
            this.memory.btnToggle.classList.remove("is-toggle-down");
            this.memory.btnToggle.classList.add("is-toggle-up");
            this.dispatch({
                type: "updateModalPosition",
                position: "openedPreview",
            });
        }
    }

    handleClickClose() {
        this.close();
    }

    open(openId) {
        if (this.state.modal.position === "closed") {
            let cb = () => {
                this.handleOpen();
            };
            window.ajaxReload("modal", {
                callback: cb,
                args: { id_gis: openId },
                history: true,
            });
        }
    }

    async close() {
        let modal = this.getModal();
        await this.closeTransition(modal, this.memory.settings);
        this.unbindListeners(modal);
        this.dispatch({ type: "updateModalPosition", position: "closed" });
    }

    async handleOpen() {
        // rechargement Ajax, sélectionner à nouveau le conteneur
        let modal = this.getModal();
        // Gestionnaires d'événements
        this.bindListeners(modal);
        // Définir des variables supplémentaires
        this.memory.settings = {};
        let settings = this.memory.settings;
        if (this.state.windowWidth === "desktop") {
            this.updateLayout(this.state.searchboxHeight);
            settings.position = "openedFull";
            // translation depuis la gauche de la fenêtre
            settings.transitionOn = "translateX(0)";
            settings.transitionOff = "translateX(-100%)";
        } else {
            settings.position = "openedPreview";
            let height = this.calcPreviewHeight(modal) + "px";
            // translation depuis le bas de la fenêtre
            settings.transitionOn = "translateY(" + height + ")";
            settings.transitionOff = "translateY(100%)";
        }
        // Transition
        await this.openTransition(modal, settings);
        this.memory.btnClose.classList.add("is-ready-to-animate");
        this.memory.btnToggle.classList.add("is-ready-to-animate", "is-toggle-up");
        this.dispatch({
            type: "updateModalPosition",
            position: this.memory.settings.position,
        });
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
        let index,
            btns = modal.querySelectorAll("." + this.settings.btnClassName);
        this.memory.btns = btns;
        for (index = 0; index < btns.length; index++) {
            const btn = btns[index];
            this.animBtn(btn);
            btn.setAttribute("tabindex", "0");
            if (btn.id === "ModalToggle") {
                this.memory.btnToggle = btn;
            }
            if (btn.id === "ModalClose") {
                this.memory.btnClose = btn;
            }
        }
        this.memory.btnToggle.addEventListener("click", this._handleClickToggle);
        this.memory.btnClose.addEventListener("click", this._handleClickClose);
    }

    unbindListeners(modal) {
        this.memory.btnToggle.removeEventListener("click", this._handleClickToggle);
        this.memory.btnClose.removeEventListener("click", this._handleClickClose);
        for (let index = 0; index < this.memory.btns.length; index++) {
            const btn = this.memory.btns[index];
            btn.setAttribute("tabindex", "-1");
        }
        this.memory = {};
    }

    calcPreviewHeight(modal) {
        const body = modal.querySelector("." + this.settings.bodyClassName);
        const MapHeight = modal.parentElement.offsetHeight;
        const previewHeight = MapHeight - (body.offsetTop + 36);
        return previewHeight;
    }
}
