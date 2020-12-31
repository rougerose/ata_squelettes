import { config } from "./config";
/*
    Copié et adapté de https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/js/tabs.js
*/
export class Tabs {
    constructor(id) {
        this._container = document.getElementById(id);
        this._tabList = this._container.querySelector('[role="tablist"]');
        this._tabs = this._container.querySelectorAll('[role="tab"]');
        this._tabsPanels = this._container.querySelectorAll(
            '[role="tabpanel"]'
        );

        // For easy reference
        this._keys = {
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            delete: 46,
        };

        // Add or substract depending on key pressed
        this._direction = {
            37: -1,
            38: -1,
            39: 1,
            40: 1,
        };

        this._clickListener = this._clickEvent.bind(this);
        this._keydownListener = this._keydownEvent.bind(this);
        this._keyupListener = this._keyupEvent.bind(this);
        this._focusListener = this._focusEvent.bind(this);

        this._tabs.forEach((tab, index) => {
            tab.addEventListener("click", this._clickListener);
            tab.addEventListener("keydown", this._keydownListener);
            tab.addEventListener("keyup", this._keyupListener);
            tab.addEventListener("focus", this._focusListener);
            tab.index = index;
        });
    }

    _clickEvent(event) {
        const tab = event.target;
        this._activateTab(tab, false);
    }

    _keydownEvent(event) {
        const key = event.keyCode;

        switch (key) {
            case this._keys.end:
                event.preventDefault();
                // Activate last tab
                this._activateTab(this._tabs[this._tabs.length - 1]);
                break;
            case this._keys.home:
                event.preventDefault();
                // Activate first tab
                this._activateTab(this._tabs[0]);
                break;

            // Up and down are in keydown
            // because we need to prevent page scroll >:)
            case this._keys.up:
            case this._keys.down:
                this._determineOrientation(event);
                break;
        }
    }

    _keyupEvent(event) {
        const key = event.keyCode;
        switch (key) {
            case this._keys.left:
            case this._keys.right:
                this._determineOrientation(event);
                break;
        }
    }

    _focusEvent(event) {
        const target = event.target;
        const delay = 300;
        setTimeout(() => { this._checkTabFocus(target) }, delay);
    }

    // When a tablist aria-orientation is set to vertical,
    // only up and down arrow should function.
    // In all other cases only left and right arrow function.
    _determineOrientation(event) {
        const key = event.keyCode;
        const vertical =
            this._tabList.getAttribute("aria-orientation") == "vertical";
        let proceed = false;

        if (vertical) {
            if (key === this._keys.up || key === this._keys.down) {
                event.preventDefault();
                proceed = true;
            }
        } else {
            if (key === this._keys.left || key === this._keys.right) {
                proceed = true;
            }
        }

        if (proceed) {
            this._switchTabOnArrowPress(event);
        }
    }

    // Either focus the next, previous, first, or last tab
    // depening on key pressed
    _switchTabOnArrowPress(event) {
        const pressed = event.keyCode;

        if (this._direction[pressed]) {
            const target = event.target;
            if (target.index !== undefined) {
                if (this._tabs[target.index + this._direction[pressed]]) {
                    this._tabs[target.index + this._direction[pressed]].focus();
                } else if (pressed === this._keys.left || pressed === this._keys.up) {
                    this._focusLastTab();
                } else if (
                    pressed === this._keys.right ||
                    pressed == this._keys.down
                ) {
                    this._focusFirstTab();
                }
            }
        }
    }

    // Activates any given tab panel
    _activateTab(tab, setFocus) {
        setFocus = setFocus || true;
        // Deactivate all other tabs
        this._deactivateTabs();
        // Remove tabindex attribute
        tab.removeAttribute("tabindex");
        // Set the tab as selected
        tab.setAttribute("aria-selected", "true");
        // Get the value of aria-controls (which is an ID)
        const controls = tab.getAttribute("aria-controls");
        // Remove hidden attribute from tab panel to make it visible
        document.getElementById(controls).removeAttribute("hidden");
        // Set focus when required
        if (setFocus) {
            tab.focus();
        }
    }

    // Deactivate all tabs and tab panels
    _deactivateTabs() {
        this._tabs.forEach((tab) => {
            tab.setAttribute("tabindex", "-1");
            tab.setAttribute("aria-selected", "false");
            tab.removeEventListener("focus", this._focusListener);
        });
        this._tabsPanels.forEach((panel) => {
            panel.setAttribute("hidden", "hidden");
        });
    }

    _focusFirstTab() {
        this._tabs[0].focus();
    }

    _focusLastTab() {
        this._tabs[this._tabs.length - 1].focus();
    }

    // Only activate tab on focus if it still has focus after the delay
    _checkTabFocus(target) {
        console.log(this);
        const focused = document.activeElement;

        if (target === focused) {
            this._activateTab(target, false);
        }
    }

    //* Gestion des requêtes
    _onclickActivityKeyword(event) {

    }
}
