import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export class Modal {
	constructor(id) {
		this.id = id;
		this._modal = document.getElementById(id);
		this._height = this._modal.scrollHeight;
		this._bounds = this._modal.getBoundingClientRect();
		let that = this;
		console.log(this._height, this._bounds);
		/*
		document.body.scrollHeight - this._modal.offsetTop
		*/

		Draggable.create("#" + this.id, {
			// callbackScope: this._modal,
			type: "y",
			bounds: { minY: 50, maxY: -125 }, // maxY:-125
			// edgeResistance: 0.5,
			dragResistance: 0.7,
			zIndexBoost: false,
			liveSnap: true,
			onMove: function () {
				console.log(this.y);
			},
			// onDragEnd: function (e) {
			// 	console.log(that);
			// 	if (this.y <= 96) {
			// 		// toggleModal(this.target, false);
			// 	} else if (this.y >= 108) {
			// 		// toggleModal(this.target, true);
			// 	}
			// },
			onDragEnd: function () {
				if (this.y <= -10) {
					that.toggleModal("open");

				} else if (this.y >= 5) {
					that.toggleModal("close");
				}
			},
		});
	}

	toggleModal(open) {
		if (open === "open") {
			gsap.to(this._modal, { bottom: 0, duration: 0.35 });
			this._modal.classList.add("open");
		} else {
			gsap.to(this._modal, { bottom: -120, duration: 0.35 });
			this._modal.classList.add("close");
		}
	}
}
