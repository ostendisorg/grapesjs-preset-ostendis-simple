import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { TraitManager } = editor;

  // Ostendis-Blocks trait
  TraitManager.addType("ost-blocks-select", {
    createInput({ trait }) {
      const traitOpts = trait.get("options") || [];
      const traitName = trait.get("name") || "ost-block-select";
      const options = traitOpts.length ? traitOpts : [{ id: "", name: "None", disabled: "disabled" }];

      const el = document.createElement("div");
      el.innerHTML = `
        <select class="ost-blocks-select" id="${traitName}">
          ${options.map((opt) => `<option value="${opt.id}" ${opt.disabled}>${opt.name}</option>`).join("")}
        </select>
        <div class="gjs-sel-arrow">
          <div class="gjs-d-s-arrow"></div>
        </div>`;
      return el;
    },
    onEvent({ elInput, component, trait }) {
      const traitName = trait.get("name") || "ost-block-select-default";
      let element = elInput.querySelector("#" + [traitName]) as HTMLSelectElement;
      const dataOstType = element.value;

      if (dataOstType == "") {
        component.removeAttributes(traitName);
      } else {
        component.addAttributes({ [traitName]: dataOstType });
      }
      updateTrait(element);
    },
    onUpdate({ elInput, component, trait }) {
      const traitName = trait.get("name") || "ost-block-select-default";

      if (elInput !== null) {
        let element = elInput.querySelector("#" + [traitName]) as HTMLSelectElement;
        updateTrait(element);

        // Set select
        const dataOstType = component.getAttributes()[traitName] || "";
        element = elInput.querySelector("#" + [traitName]) as HTMLSelectElement;
        element.value = dataOstType;
      }
    },
  });

  // Range trait
  TraitManager.addType("value", {
    label: opts.t9n.traitBlkValue,
    min: 0, // Minimum number value
    max: 100, // Maximum number value
    events: {
      keyup: "onChange",
    },

    onValueChange() {
      const { model, target } = this;
      const optionsStr = model.get("value").trim();
      const options = optionsStr.split("\n");
      const optComps = [];

      for (let i = 0; i < options.length; i++) {
        const optionStr = options[i];
        const option = optionStr.split("::");
        optComps.push({
          type: "range",
          components: option[1] || option[0],
          attributes: { value: option[0] },
        });
      }

      target.components().reset(optComps);
      target?.view?.render();
    },
  });

  function updateTrait(element: HTMLSelectElement) {
    // Set Array to 0
    opts.usedOstBlocks.forEach((el) => {
      el.count = 0;
    });

    var wrapper = editor.DomComponents.getWrapper();
    var elements = wrapper?.view?.$el.find("[data-ost-type]").get();

    // List all data-ost-type
    elements?.forEach((element) => {
      var type = element.getAttribute("data-ost-type") || "";
      let index = opts.usedOstBlocks.findIndex((item) => item.name === type);
      if (index === -1) {
        opts.usedOstBlocks.push({ name: type, count: 1 });
      } else {
        opts.usedOstBlocks[index].count++;
      }
    });

    // Display update select input
    Array.from(element.options).forEach(function (optionElement, optionIndex) {
      if (optionElement.value != "") {
        const usedOstBlockIndex = opts.usedOstBlocks.findIndex((e) => e.name === optionElement.value);

        // Reset
        var optionEl = element.options[optionIndex];
        optionEl.text = optionEl.text.replace(/^\(.*\)\s*/g, "");
        optionEl.removeAttribute("class");
        optionEl.removeAttribute("disabled");

        if (usedOstBlockIndex > -1) {
          if (opts.usedOstBlocks[usedOstBlockIndex].count == 1) {
            optionEl.innerHTML = "(&#10003;) " + optionEl.text;
            optionEl.classList.add("gjs-select-option-ok");
            optionEl.disabled = true;
          } else if (opts.usedOstBlocks[usedOstBlockIndex].count > 1) {
            optionEl.innerHTML = "(! " + opts.usedOstBlocks[usedOstBlockIndex].count + "&times;) " + optionEl.text;
            optionEl.classList.add("gjs-select-option-nok");
            optionEl.disabled = true;
          }
        }
      }
    });
  }
};
