import TouchDragListener from "bottom-sheet/src/TouchDragListener";

export class Panes {
	constructor(id) {
		this.id = id;
		this.el = document.getElementById(id);
		this.pane = this.el.querySelector(".mp-Pane");
		this.paneListener = new TouchDragListener({
			el: this.pane,
			touchStartCallback: ({
				el,
				active,
				initialY,
				currentY,
				yOffset,
			}) => {
				el.style.setProperty("--translateY", `translateY(0)`);
				el.style.setProperty("transition", `unset`);
			},
			touchEndCallback: ({ el, active, initialY, currentY, yOffset }) => {
				el.style.setProperty(
					"transition",
					`transform 150ms cubic-bezier(0.4, 0, 0.2, 1)`
				);
				el.style.setProperty(
					"--translateY",
					`translateY(${currentY}px)`
				);
			},
			touchMoveCallback: ({
				el,
				active,
				initialY,
				currentY,
				yOffset,
			}) => {
				if (currentY <= -40) {
					currentY = -41 + currentY / 10;
				} else if (currentY <= -60) {
					currentY = -60;
				} else if (currentY >= 210) {
					this.deactivate(currentY);
					return;
				}

				el.style.setProperty(
					"--translateY",
					`translateY(${currentY}px)`
				);
			},
			// showLog: true,
		});
	}

	open() {
		console.log(this.pane);
		this.el.classList.remove("is-collapsed");
		this.el.classList.add("is-visible");
	}

	addContent(content) {
		let container = this.pane;
		if (typeof content === "string") {
			container.innerHTML = content;
		} else {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
			container.appendChild(content);
		}
		return this;
	}

	deactivate(translateY) {
		if (!translateY) {
			this.sheet.style.setProperty("--translateY", `translateY(201px)`);
		} else {
			this.sheet.style.setProperty(
				"transition",
				`transform 150ms cubic-bezier(0.4, 0, 0.2, 1)`
			);
			this.sheet.style.setProperty(
				"--translateY",
				`translateY(${translateY}px)`
			);
		}

		this.el.classList.remove("is-visible");
		this.el.classList.add("is-collapsed");
	}
}
