import { config } from "./config";
import { Tabs } from "./Tabs";
import { Keywords } from "./Keywords";

export class SearchBox {
    constructor(id) {
        this._container = document.getElementById(id);
        this._initLayout(this._container);
        this._advancedSearchIsOpen = false;

        // Tabs : initialisation
        this.tabs = new Tabs("tabs");

        // Keywords : initialisation des critères de recherche
        this.keywords = new Keywords(this._container);

    }

    _initLayout(container) {
        // Labels
        this._labels = container.querySelectorAll("label");
        this._labels.forEach((label) => {
            label.classList.add("js-Searchbox_Label");
        });

        // Inputs text
        this._inputs = container.querySelectorAll("input[type=text]");
        this._inputs.forEach((input, index) => {
            input.addEventListener("focus", this._handlerInputEvent);
            input.addEventListener("blur", this._handlerInputEvent);
        });

        // Cancel Buttons (formulaires)
        this._cancelBtns = container.querySelectorAll("button[type=reset]");
        this._cancelBtns.forEach((btn, index) => {
            const uid = btn.dataset.relId;
            const input = container.querySelector("[data-id='" + uid + "']");
            btn.addEventListener("click", this._onclickCancelBtn.bind(input));
        });

        // Advanced Search button
        this._advancedSearchBtn = container.querySelector(
            config.searchBox.btnAdvancedId
        );
        this._advancedSearchBtn.addEventListener("click", () => {
            this._toggleSearchBoxPanels();
        });

        // Panels fulltext/advanced
        this._panels = container.querySelectorAll(
            "." + config.searchBox.panelClassName
        );
        if (!this._advancedSearchIsOpen) {
            for (let index = 0; index < this._panels.length; index++) {
                const panel = this._panels[index];
                if (index == 0) {
                    this._setHiddenState(panel, "false");
                } else {
                    this._setHiddenState(panel, "true");
                }
            }
        }
    }

    _setHiddenState(element, hidden) {
        element.setAttribute("aria-hidden", hidden);
    }

    _toggleSearchBoxPanels() {
        // Quel panneau doit être affiché ?
        let panelToShow = this._advancedSearchIsOpen ? 0 : 1;

        if (this._advancedSearchIsOpen) {
            // Fermer (état initial)
            this._advancedSearchBtn.setAttribute("aria-expanded", "false");
            this._advancedSearchIsOpen = false;
        } else {
            // Ouvrir
            this._advancedSearchBtn.setAttribute("aria-expanded", "true");
            this._advancedSearchIsOpen = true;
        }

        // sélectionner le panneau à fermer
        const closePanel = this._panels[1 - panelToShow];
        // et celui à ouvrir
        const openPanel = this._panels[panelToShow];

        // Animer l'un après l'autre
        const close = new Promise((resolve, reject) => {
            const onhide = (event) => {
                this._toggleAriaHiddenState(closePanel, true);
                this._toggleAriaBusyState(closePanel, false);
                closePanel.removeEventListener("transitionend", onhide);
            };
            closePanel.addEventListener("transitionend", onhide);
            closePanel.style.height =
                closePanel.getBoundingClientRect().height + "px";
            this._toggleAriaBusyState(closePanel, true);
            closePanel.offsetHeight; // reflow
            closePanel.style.height = "";
            resolve();
        });

        close.then(() => {
            const onshow = (event) => {
                openPanel.style.height = "";
                this._toggleAriaBusyState(openPanel, false);
                openPanel.removeEventListener("transitionend", onshow);
            };
            this._toggleAriaBusyState(openPanel, true);
            this._toggleAriaHiddenState(openPanel, false);
            openPanel.addEventListener("transitionend", onshow);
            openPanel.offsetHeight; // reflow
            const scrollHeight = openPanel.scrollHeight;
            openPanel.style.height = scrollHeight + "px";
        }, openPanel);
    }

    _toggleAriaBusyState(element, bool) {
        element.setAttribute("aria-busy", bool);
    }

    _toggleAriaHiddenState(element, bool) {
        element.setAttribute("aria-hidden", bool);
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
}
