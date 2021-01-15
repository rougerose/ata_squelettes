class AriaListbox {
    constructor(el, opts) {
        if (!(el instanceof HTMLElement)) {
            throw new Error(
                "The listbox container element must be the first parameter to AriaListbox"
            );
        }
        this.el = el;
        this.opts = opts || {};
        this.opts.prevKeys = this._normalizeKeyOptions(this.opts.prevKeys, [
            38,
        ]);
        this.opts.nextKeys = this._normalizeKeyOptions(this.opts.nextKeys, [
            40,
        ]);
        this.opts.selectKeys = this._normalizeKeyOptions(this.opts.selectKeys, [
            13,
            32,
        ]);
        // TODO : add opts.dataset (for custom event)

        this._handleClick = this._handleClick.bind(this);
        this._handleKeydown = this._handleKeydown.bind(this);
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
        Array.prototype.forEach.call(
            this.el.querySelectorAll("[tabindex]"),
            function (n) {
                n.removeAttribute("tabindex");
            }
        );
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

        if (this.opts.selectKeys.indexOf(code) !== -1) {
            this._select(optionEl);
        } else if (
            event.target &&
            event.target.getAttribute("role") === "option"
        ) {
            this._handleKey(optionEl, code, this.opts.nextKeys, 1);
            this._handleKey(optionEl, code, this.opts.prevKeys, -1);
        }
    }

    mount() {
        let firstSelected = this.el.querySelector('[aria-selected="true"]');

        if (firstSelected) {
            firstSelected.setAttribute("tabindex", "0");
        } else {
            let options = this.el.querySelectorAll(
                '[role="option"]:not([aria-disabled="true"])'
            );
            if (options.length) {
                options[0].setAttribute("tabindex", 0);
            }
        }

        this.el.addEventListener("click", this._handleClick);

        this.el.addEventListener("keydown", this._handleKeydown);
    }

    _select(child) {
        if (child.getAttribute("aria-disabled") === "true") {
            return;
        }
        const multiselect = this.el.getAttribute("aria-multiselectable") === "true";

        if (!multiselect) {
            Array.prototype.forEach.call(
                this.el.querySelectorAll('[aria-selected="true"]'),
                function (n) {
                    n.removeAttribute("aria-selected");
                }
            );
        }

        let evt;

        if (multiselect && child.getAttribute("aria-selected") === "true") {
            child.removeAttribute("aria-selected");

            evt = new CustomEvent("listbox-selection-changed", {
                detail: {
                    action: "remove",
                    id: child.id,
                    data: [child.dataset.value, child.dataset.label],
                },
            });
        } else {
            this._clearTabIndexes();
            child.setAttribute("aria-selected", "true");
            child.setAttribute("tabindex", "0");
            child.focus();

            if (multiselect) {
                evt = new CustomEvent("listbox-selection-changed", {
                    detail: {
                        action: "add",
                        id: child.id,
                        data: [child.dataset.value, child.dataset.label],
                    },
                });
            }
        }

        evt.selection = multiselect
            ? this.el.querySelectorAll('[aria-selected="true"]')
            : child;
        this.el.dispatchEvent(evt);
    }

    _optionNode(event) {
        let optionEl = event.target;
        while (optionEl && optionEl.getAttribute("role") !== "option") {
            optionEl = optionEl.parentElement;
        }
        return optionEl;
    }

    _handleKey(optionEl, code, keys, delta) {
        if (keys.indexOf(code) !== -1) {
            const optionEls = this.el.querySelectorAll(
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
}

export default AriaListbox;
