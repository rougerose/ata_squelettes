export class Searchbox {
	constructor(id) {
		this._container = document.getElementById(id);
		this._labels = [];
		this._inputs = [];
		this._inputsId = [];
		this._buttonsCancel = [];
		this._buttonsCancelId = [];

		this._init();
	}

	_init() {
		this._labels = this._container.querySelectorAll("label");
		for (let index = 0; index < this._labels.length; index++) {
			this._labels[index].classList.add("js-Searchbox_Label");
		}

		this._inputs = this._container.querySelectorAll("input[type=text]");
		for (let index = 0; index < this._inputs.length; index++) {
			const input = this._inputs[index];
			this._inputsId[index] = input.dataset.id;
			input.addEventListener("focus", this._oneventInput);
			input.addEventListener("blur", this._oneventInput);
		}

		this._buttonsCancel = this._container.querySelectorAll(
			"button[type=reset]"
		);

		for (let index = 0; index < this._buttonsCancel.length; index++) {
			const btn = this._buttonsCancel[index];
			console.log(btn, btn.dataset.relId);
			let id = btn.dataset.relId;
			this._buttonsCancelId[index] = id;
			const idx = this._inputsId.indexOf(id);
			// console.log(btn.dataset, this._inputsId.indexOf(id), this._inputs);
			const input = this._inputs[idx];
			btn.addEventListener("click", this._onclickCancelBtn.bind(input));
		}
	}

	_oneventInput(event) {
		const parent = this.offsetParent;
		if (event.type === "focus") {
			parent.classList.add("is-focused");
		} else if (event.type == "blur" && event.target.value == "") {
			parent.classList.remove("is-focused");
		}
	}

	_onclickCancelBtn(event) {
		event.preventDefault();
		const input = this;
		input.value = null;
		input.offsetParent.classList.remove("is-focused");
	}
}
