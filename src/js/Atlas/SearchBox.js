import { config } from "./config";

export class SearchBox {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this._container = container.querySelector(config.searchBox.id);
        this._advancedSearchIsOpen = false;
        this.dispatch = dispatch;
        this._initLayout(this._container);
    }

    _getHeight() {
        return this._container.offsetHeight;
    }

    getWidth() {
        return this._container.offsetWidth;
    }

    updateHeight(value) {
        let height = value || this._getHeight();
        this.dispatch({
            type: "updateSearchboxHeight",
            searchboxHeight: height,
        });
    }

    _initLayout(container) {
        // Inputs text
        this._inputs = container.querySelectorAll("input[type=text]");
        [].forEach.call(this._inputs, (input) => {
            input.addEventListener("focus", this._handlerInputEvent);
            input.addEventListener("blur", this._handlerInputEvent);
        });

        // Cancel Buttons (formulaires)
        this._cancelBtns = container.querySelectorAll("button[type=reset]");
        [].forEach.call(this._cancelBtns, (cancelBtn) => {
            const uid = cancelBtn.dataset.relId;
            const input = container.querySelector("[data-id='" + uid + "']");
            cancelBtn.addEventListener(
                "click",
                this._onclickCancelBtn.bind(input)
            );
        });

        // Advanced Search button
        this._advancedSearchBtn = container.querySelector(
            config.searchBox.btnAdvancedId
        );
        this._advancedSearchBtn.addEventListener("click", () => {
            this._togglePanels();
        });

        // Panels fulltext/advanced
        this._panels = container.querySelectorAll(
            "." + config.searchBox.panelClassName
        );
        if (!this._advancedSearchIsOpen) {
            for (let index = 0; index < this._panels.length; index++) {
                const panel = this._panels[index];
                if (index == 0) {
                    panel.setAttribute("aria-hidden", "false");
                } else {
                    panel.setAttribute("aria-hidden", "true");
                }
            }
        }
    }

    _togglePanels() {
        // Quel panneau doit être affiché ?
        let panelToShow = this._advancedSearchIsOpen ? 0 : 1;
        if (this._advancedSearchIsOpen) {
            // Fermer (état initial)
            this._advancedSearchBtn.setAttribute("aria-expanded", "false");
            this._advancedSearchBtn.classList.remove("is-open");
            this._advancedSearchIsOpen = false;
        } else {
            // Ouvrir
            this._advancedSearchBtn.setAttribute("aria-expanded", "true");
            this._advancedSearchBtn.classList.add("is-open");
            this._advancedSearchIsOpen = true;
        }
        // sélectionner le panneau à fermer
        const closePanel = this._panels[1 - panelToShow];
        // et celui à ouvrir
        const openPanel = this._panels[panelToShow];

        this.close(closePanel);
        this.open(openPanel);
    }

    close(panel) {
        panel.setAttribute("aria-hidden", "true");
    }

    open(panel) {
        panel.setAttribute("aria-hidden", "false");
        this.updateHeight();
    }

    _handlerInputEvent(event) {
        const parentElement = this.offsetParent;
        if (event.type === "focus") {
            parentElement.classList.add("is-focused");
        } else if (event.type === "blur" && event.target.value === "") {
            parentElement.classList.remove("is-focused");
        }
    }

    _onclickCancelBtn(event) {
        event.preventDefault();
        const input = this;
        input.value = null;
        input.offsetParent.classList.remove("is-focused");
    }

    syncState(state) {
        this.state = state;
        if (this.state.searchboxHeight === null) {
            let height = this._getHeight();
            this.state.searchboxHeight = height;
            this.updateHeight(height);
        }
    }
}
