import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import { ostTypeTextTrait, ostTypeImageTrait, ostTypeHideInSimpleHtmlTrait, iconTrait } from "./consts";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Scale the new range
  DomComponents.addType("scale", {
    isComponent: (el) => el.tagName === "DIV" && el.classList.contains("scale"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "scale", "data-percent": "66", "data-fcolor": "#3b5998", "data-bgcolor": "#CCCCCC" },
        style: { "box-sizing": "border-box", padding: "0", height: "20px", "max-width": "100%", border: "0px solid #666666", background: "linear-gradient(to right,#3b5998 66%, #CCCCCC 66%);" },
        traits: [
          {
            name: "percent",
            type: "number",
            min: 0,
            max: 100,
            label: opts.t9n.labelScalePercent,
            changeProp: true,
          },
          {
            name: "fcolor",
            type: "color",
            label: opts.t9n.labelScaleBarColor,
            placeholder: "#222222",
            changeProp: true,
          },
          {
            name: "bgcolor",
            type: "color",
            label: opts.t9n.labelScaleBgColor,
            placeholder: "#cccccc",
            changeProp: true,
          },
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
      init() {
        const scaleAttr = this.getAttributes();
        this.set("percent", scaleAttr["data-percent"]);
        this.set("bgcolor", scaleAttr["data-bgcolor"]);
        this.set("fcolor", scaleAttr["data-fcolor"]);

        this.on("change:percent", this.updateScale);
        this.on("change:bgcolor", this.updateScale);
        this.on("change:fcolor", this.updateScale);
      },
      updateScale() {
        var p = this.get("percent");
        var b = this.get("bgcolor");
        var f = this.get("fcolor");
        this.set("attributes", { "data-percent": p, "data-bgcolor": b, "data-fcolor": f });
        this.addStyle({ background: "linear-gradient(to right, " + f + " " + p + "%, " + b + " " + p + "%)" });
      },
    },
  });
  // Range trait
  const nameTrait = {
    name: "name",
  };
  const valueTrait = {
    name: "value",
    label: opts.t9n.traitBlkValue,
  };

  // INPUT
  DomComponents.addType("range", {
    isComponent: (el) => el.tagName == "INPUT",
    model: {
      defaults: {
        tagName: "input",
        droppable: true,
        highlightable: true,
        traits: [nameTrait, valueTrait],
        attributes: { type: "range", disabled: true },
      },
    },
    extendFnView: ["updateAttributes"],
    view: {
      updateAttributes() {
        this.el.setAttribute("autocomplete", "on");
      },
    },
  });
  // Unsorted list item component
  const uListItemContent = `<span class="fa-li" style="left:-2em;width:2em;" draggable="false" removable="false" editable="false" copyable="false">
  <i class="fas fa-circle" data-gjs-type="icon" style="font-size:0.4em;line-height:inherit;display:block;" draggable="false" removable="false" editable="false" copyable="false"></i>
  </span>
  <p style="margin:0;padding:0;text-align:left;" draggable="false" removable="false" copyable="false">Text</p>`;
  DomComponents.addType("ulistitem", {
    isComponent: (el) => {
      if (el.tagName === "LI" && el.classList.contains("ulistitem")) {
        return { type: "ulistitem" };
      }
    },
    model: {
      defaults: {
        tagName: "li",
        draggable: "ul",
        attributes: { class: "ulistitem" },
        style: { "text-align": "left" },
        components: uListItemContent,
        traits: ["id", "title", ostTypeTextTrait(opts)],
      },
    },
  });
  // Unsorted list component with fontawesome
  const ulListItem = `<li style="text-align:left" data-gjs-type="ulistitem">` + uListItemContent + `</li>`;
  DomComponents.addType("ulist", {
    isComponent: (el) => {
      if (el.tagName === "UL" && el.classList.contains("ulist")) {
        return { type: "ulist" };
      }
    },
    model: {
      defaults: {
        tagName: "ul",
        attributes: { class: "ulist fa-ul" },
        style: { padding: "0.2em 0", "margin-left": "2em", "line-height": "1.4em" },
        components: ulListItem + ulListItem + ulListItem,
        traits: ["id", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Icon component
  DomComponents.addType("icon", {
    isComponent: (el) => {
      var classNames = ["fa", "fas", "far", "fab", "fa-solid", "fa-regular", "fa-brands"];
      if (el.tagName === "I" && classNames.some((className) => el.classList.contains(className))) {
        return { type: "icon" };
      }
    },
    model: {
      defaults: {
        tagName: "i",
        attributes: { class: "fas fa-star" },
        draggable: false,
        droppable: false,
        removable: false,
        copyable: false,
        traits: [ iconTrait(opts), ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });
  // Add ostendis type trait to table components
  DomComponents.addType("table", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Add ostendis type trait to link components
  DomComponents.addType("link", {
    model: {
      defaults: {
        traits: ["id", "href", "target", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Add ostendis type trait to image components
  DomComponents.addType("image", {
    model: {
      defaults: {
        traits: ["alt", ostTypeImageTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Add ostendis type trait to text components
  DomComponents.addType("textnode", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Add ostendis type trait to text components
  DomComponents.addType("text", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
  // Add ostendis type trait to default components
  DomComponents.addType("default", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
};
