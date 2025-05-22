import throttle from "lodash.throttle";
import TomSelect from "tom-select/base";
import dropdownInput from "tom-select/plugins/dropdown_input/plugin.js";

function addArrow(options) {
	// plugin_options: plugin-specific options
	// this: TomSelect instance
	this.hook('after', 'setup', () => {
		const arrowElem = document.createElement("span");
		arrowElem.classList.add("select__arrow");
		this.control.append(arrowElem);
	});
};
function dropdownPosition(options) {
	const dropdownMinWidth = 400;
	this.on('dropdown_open', resetPosition);
	const self = this;
	
	window.addEventListener("resize", throttle(resetPosition, 25));

	function resetPosition() {
		const wrapperBcr = self.wrapper.getBoundingClientRect();
		if (wrapperBcr.right - dropdownMinWidth > 0 || self.wrapper.offsetWidth > dropdownMinWidth) {
			self.dropdown.classList.remove("select__dropdown--left");
			self.dropdown.classList.add("select__dropdown--right");
		} else {
			self.dropdown.classList.remove("select__dropdown--right");
			self.dropdown.classList.add("select__dropdown--left");
		} 
	}
};

TomSelect.define("add-arrow", addArrow);
TomSelect.define("dropdown-position", dropdownPosition);
TomSelect.define("dropdown-input", dropdownInput);


function initSingleSelect(root) {
	const isMulty = root.hasAttribute("multiple");
	const plugins = {
		//"addLabel": {},
		"add-arrow": {},
		"dropdown-position": {},
		"dropdown-input": {},
		// "change_listener": {},
		// "rebuild_on_update": {},
	};
	// if (isMulty) {
	// 	plugins["add_actions"] = {};
	// 	plugins["add_select_all"] = {};
	// 	plugins["dropdown_input"] = {};
	// } else if (withDrop) {
	// 	plugins["clear_button"] = { 'title':'Remove all selected options', className: "select__clear-btn" }
	// }
	//if (isMulty) plugins.multiselect = {};

	const tomSelect = new TomSelect(root, {
		wrapperClass: "select",
		controlClass: "select__control",
		dropdownClass: "select__dropdown",
		dropdownContentClass: "select__options-list custom-scrollbar",
		optionClass: 'select__option',
		itemClass: "select__item",
		controlInput: null,
		hideSelected: false,
		render: {
			option: function(data, escape) {
				//${isMulty ? `<div class="select__option-checkbox"></div>` : ""}
				return `<div class="select__option ${data.disabled && "select__option--disabled" || ""}">
									<div class="select__option-text">${escape(data.text)}</div>
								</div>`;
			},
			no_results:function(data, escape){
				return '<div class="no-results">Нет совпадений</div>';
			},
		},
		plugins
	});

	root.form?.addEventListener("reset", () => {
		tomSelect.clear();
		tomSelect.refreshItems();
	});
	return tomSelect;
}

window.app.initSelects = () => document.querySelectorAll(`[data-component*=":select:"]:not(.tomselected)`).forEach(initSingleSelect);
app.initSelects();