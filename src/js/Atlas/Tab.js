export class Tab {
    constructor(state, { container, dispatch }) {
        this._state = state;
        this.container = container.querySelector("#Tab");
        // For easy reference
        this.keys = {
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            delete: 46,
        };

        // Add or substract depending on key pressed
        this.direction = {
            37: -1,
            38: -1,
            39: 1,
            40: 1,
        };

        this.initLayout(this.container);
    }

    initLayout() {
        this.tabList = this.container.querySelector('[role="tablist"]');
        this.tabs = this.container.querySelectorAll('[role="tab"]');
        this.tabsPanels = this.container.querySelectorAll('[role="tabpanel"]');

        const listener = (event) => {
            switch (event.type) {
                case "click":
                    this.clickEvent(event);
                    break;
                case "keydown":
                    this.keydownEvent(event);
                    break;
                case "keyup":
                    this.keyupEvent(event);
                    break;
                case "focus":
                    this.focusEvent(event);
                    break;
            }
        }

        this.tabs.forEach((tab, index) => {
            tab.addEventListener("click", listener);
            tab.addEventListener("keydown", listener);
            tab.addEventListener("keyup", listener);
            tab.addEventListener("focus", listener);
            tab.index = index;
        });
    }

    clickEvent(event) {
        const tab = event.target;
        console.log("event", tab);
        this.activateTab(tab, false);
    }

    keydownEvent(event) {
        const key = event.keyCode;

        switch (key) {
            case this.keys.end:
                event.preventDefault();
                // Activate last tab
                this.activateTab(this.tabs[this.tabs.length - 1]);
                break;
            case this.keys.home:
                event.preventDefault();
                // Activate first tab
                this.activateTab(this.tabs[0]);
                break;

            // Up and down are in keydown
            // because we need to prevent page scroll >:)
            case this.keys.up:
            case this.keys.down:
                this.determineOrientation(event);
                break;
        }
    }

    keyupEvent(event) {
        const key = event.keyCode;
        switch (key) {
            case this.keys.left:
            case this.keys.right:
                this.determineOrientation(event);
                break;
        }
    }

    focusEvent(event) {
        const target = event.target;
        const delay = 300;
        setTimeout(() => {
            this.checkTabFocus(target);
        }, delay);
    }

    // When a tablist aria-orientation is set to vertical,
    // only up and down arrow should function.
    // In all other cases only left and right arrow function.
    determineOrientation(event) {
        const key = event.keyCode;
        const vertical =
            this.tabList.getAttribute("aria-orientation") == "vertical";
        let proceed = false;

        if (vertical) {
            if (key === this.keys.up || key === this.keys.down) {
                event.preventDefault();
                proceed = true;
            }
        } else {
            if (key === this.keys.left || key === this.keys.right) {
                proceed = true;
            }
        }

        if (proceed) {
            this.switchTabOnArrowPress(event);
        }
    }

    // Either focus the next, previous, first, or last tab
    // depening on key pressed
    switchTabOnArrowPress(event) {
        const pressed = event.keyCode;

        if (this.direction[pressed]) {
            const target = event.target;
            if (target.index !== undefined) {
                if (this.tabs[target.index + this.direction[pressed]]) {
                    this.tabs[target.index + this.direction[pressed]].focus();
                } else if (
                    pressed === this.keys.left ||
                    pressed === this.keys.up
                ) {
                    this.focusLastTab();
                } else if (
                    pressed === this.keys.right ||
                    pressed == this.keys.down
                ) {
                    this.focusFirstTab();
                }
            }
        }
    }

    // Activates any given tab panel
    activateTab(tab, setFocus) {
        console.log(tab);
        setFocus = setFocus || true;
        // Deactivate all other tabs
        this.deactivateTabs();
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
    deactivateTabs() {
        this.tabs.forEach((tab) => {
            tab.setAttribute("tabindex", "-1");
            tab.setAttribute("aria-selected", "false");
            tab.removeEventListener("focus", this.focusListener);
        });
        this.tabsPanels.forEach((panel) => {
            panel.setAttribute("hidden", "hidden");
        });
    }

    focusFirstTab() {
        this.tabs[0].focus();
    }

    focusLastTab() {
        this.tabs[this.tabs.length - 1].focus();
    }

    // Only activate tab on focus if it still has focus after the delay
    checkTabFocus(target) {
        const focused = document.activeElement;
        console.log("checktab", target);
        if (target === focused) {
            this.activateTab(target, false);
        }
    }

    syncState() {}
}
