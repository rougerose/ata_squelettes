L.Control.AtaPanes = L.Control.extend({
	includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
	options: {
		container: null,
	},
	initialize: function (options) {
		L.setOptions(this, options);

		this._panes = [];

		return this;
	},

	onAdd: function (map) {
		let i, container;
		// use container from previous onAdd()
		container = this._container;

		// use the container given via options.
		if (!container) {
			container =
				this._container || typeof this.options.container === "string"
					? L.DomUtil.get(this.options.container)
					: this.options.container;
		}

		// Store panes
		this._panes = container.querySelectorAll(".mp-Pane");

		// Set drag listeners
		// this._dragPane(this._container, "on");

		// if no container
		if (!container) {
			return null;
			// container = L.DomUtil.create("div", "leaflet-searchbox collapsed");
			// container.id = this.options.container;
		}
		// Find paneContainer in DOM & store reference
		// this._paneContainer = container.querySelector(
		// 	"div.leaflet-searchbox-content"
		// );

		return container;
	},

	addTo: function (map) {
		this._map = map;
		this._container = this.onAdd(map);
		if (this._container) {
			L.DomUtil.addClass(this._container, "leaflet-control");
			L.DomUtil.addClass(this._container,"leaflet-panes-bottom");
			if (L.Browser.touch) {
				L.DomUtil.addClass(this._container, "leaflet-touch");
			}
			//when adding to the map container, we should stop event propagation
			L.DomEvent.disableScrollPropagation(this._container);
			L.DomEvent.disableClickPropagation(this._container);
			L.DomEvent.on(
				this._container,
				"contextmenu",
				L.DomEvent.stopPropagation
			);
			//insert as first child of map container (important for css)
			map._container.insertBefore(this._container, map._container.firstChild);
		}
		return this;
	},

	_dragPane: function (pane, on) {
		if (on === "on") {
			L.DomEvent.on(pane, "")
		}
	}
});

L.control.atapanes = function (options) {
	return new L.Control.AtaPanes(options);
};
