export class Keyword {
    constructor(state, { container, dispatch }) {
        this.state = state;
        this.dispatch = dispatch;
        this.container = container.querySelector("#Keyword");

        // listbox
        this.listbox = container.querySelector("#listBox");
        this.options = { prevKeys: 37, nextKeys: 39 };
        this._setupOptions(this.options);
        this._handleClick = this._handleClick.bind(this);
        this._handleKeydown = this._handleKeydown.bind(this);
        this._mount();
    }

    syncState(state) {
        if (state.keywords.size !== this.state.keywords.size) {
            if (state.keywords.size === 0) {
                // Supprimer toute la sélection
                this._clearTabIndexes();
                this._clearAllSelectedItems();
                this.state.keywords = state.keywords;
            } else {
                // Supprimer, mais sélectionner à nouveau l'éventuel mot-clé
                // qui appartient à la liste gérée par ce module.
                this._clearTabIndexes();
                this._clearAllSelectedItems();
                // mettre à jour state pour éviter une boucle sans fin.
                this.state.keywords = state.keywords;
                for (const [key] of state.keywords) {
                    const item = this.listbox.querySelector('li[data-value="' + key + '"]');
                    // Le mot-clé à ajouter n'appartient pas nécessairement à la liste gérée par ce modèle.
                    if (item) {
                        this._select(item);
                    }
                }
            }
        }
    }

    dispatchAction(action, keyword) {
        this.dispatch({
            type: action,
            keyword: keyword,
        });
    }

    add(keyword) {
        if (!this.state.keywords.has(keyword.value)) {
            this.dispatchAction("addKeyword", keyword);
        }
    }

    remove(keyword) {
        if (this.state.keywords.has(keyword.value)) {
            this.dispatchAction("removeKeyword", keyword);
        }
    }

    _setupOptions(options) {
        let opts = options || {};
        opts.prevKeys = this._normalizeKeyOptions(opts.prevKeys, [38]);
        opts.nextKeys = this._normalizeKeyOptions(opts.nextKeys, [40]);
        opts.selectKeys = this._normalizeKeyOptions(opts.selectKeys, [13, 32]);
        this.options = opts;
    }

    _normalizeKeyOptions(keys, defaults) {
        if (!Array.isArray(keys)) {
            keys = keys ? [keys] : defaults;
        }
        return keys.map(function (k) {
            return typeof k === "string" && !Number(k)
                ? k.charCodeAt(0)
                : Number(k);
        });
    }

    _clearTabIndexes() {
        let tabindexes = this.listbox.querySelectorAll("[tabindex]");
        for (let index = 0; index < tabindexes.length; index++) {
            tabindexes[index].removeAttribute("tabindex");
        }
    }

    _clearAllSelectedItems() {
        let items = this.listbox.querySelectorAll("[aria-selected=true]");
        for (let index = 0; index < items.length; index++) {
            items[index].setAttribute("aria-selected", "false");
        }
    }

    _handleClick(event) {
        event.preventDefault();
        let optionEl = this._optionNode(event);
        if (optionEl) {
            this._select(optionEl);
        }
    }

    _handleKeydown(event) {
        let optionEl = this._optionNode(event),
            code = event.keyCode || event.code;

        if (!optionEl) {
            return;
        }

        if (this.options.selectKeys.indexOf(code) !== -1) {
            this._select(optionEl);
        } else if (
            event.target &&
            event.target.getAttribute("role") === "option"
        ) {
            this._handleKey(optionEl, code, this.options.nextKeys, 1);
            this._handleKey(optionEl, code, this.options.prevKeys, -1);
        }
    }

    _handleKey(optionEl, code, keys, delta) {
        if (keys.indexOf(code) !== -1) {
            const optionEls = this.listbox.querySelectorAll(
                    '[role="option"]:not([aria-disabled="true"])'
                ),
                idx = Array.prototype.indexOf.call(optionEls, optionEl);

            const next = optionEls[idx + delta];
            if (next) {
                this._clearTabIndexes();
                next.setAttribute("tabindex", 0);
                next.focus();
            }
        }
    }

    _mount() {
        let firstSelected = this.listbox.querySelector(
            '[aria-selected="true"]'
        );

        if (firstSelected) {
            firstSelected.setAttribute("tabindex", "0");
        } else {
            let options = this.listbox.querySelectorAll(
                '[role="option"]:not([aria-disabled="true"])'
            );
            if (options.length) {
                options[0].setAttribute("tabindex", 0);
            }
        }

        this.listbox.addEventListener("click", this._handleClick);
        this.listbox.addEventListener("keydown", this._handleKeydown);
    }

    _select(child) {
        if (child.getAttribute("aria-disabled") === "true") {
            return;
        }
        let evt;
        const multiselect =
            this.listbox.getAttribute("aria-multiselectable") === "true";
        if (!multiselect) {
            this._clearAllSelectedItems();
        }

        if (multiselect && child.getAttribute("aria-selected") === "true") {
            //! Si click sur un élément déjà sélectionné. La suppression se fait uniquement dans la liste des mots-clés en selection (keywordSelected)
            return;
            // child.removeAttribute("aria-selected");
            // this.remove({ value: child.dataset.value, label: child.dataset.label });
        } else {
            this._clearTabIndexes();
            child.setAttribute("aria-selected", "true");
            child.setAttribute("tabindex", "0");
            child.focus();

            if (multiselect) {
                this.add({
                    value: child.dataset.value,
                    label: child.dataset.label,
                });
            }
        }
    }

    _optionNode(event) {
        let optionEl = event.target;
        while (optionEl && optionEl.getAttribute("role") !== "option") {
            optionEl = optionEl.parentElement;
        }
        return optionEl;
    }
}
