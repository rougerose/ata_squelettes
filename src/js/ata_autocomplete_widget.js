$.widget("ui.autocomplete", $.ui.autocomplete, {
	options: {
		delay: 500,
		// prefix: "",
		// appendTo: "#SearchBox",
		classes: {
			"ui-autocomplete": "mp-Autocomplete_List",
		},
		position: {
			of: "#SearchBox"
		}
	},

	_renderItem: function (ul, item) {
		var label = item.label;
		var value = item.value.split(":");
		var li_class = "mp-Autocomplete_Item";

		if (value[0] === "id_adresse") {
			li_class += " mp-Autocomplete_Item-city";
		} else if (value[0] === "id_mot") {
			li_class += " mp-Autocomplete_Item-activity";
		} else if (value[0] === "id_association") {
			li_class += " mp-Autocomplete_Item-org";
		}
		return $("<li>")
			.addClass(li_class)
			.append($("<a>").addClass("mp-Autocomplete_Link").text(label))
			.appendTo(ul);
	},

	_resizeMenu: function () {
		// this.menu.element = ul
		this.menu.element.outerWidth("100%");
	},
});
