import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Define ostendis type trait for text and default components
  const ostTypeTextTrait = {
    type: "ost-blocks-select",
    label: "Ostendis Blocks",
    name: "data-ost-type",
    attributes: {
      "data-tooltip": opts.t9n.traitBlkOstendisTooltip,
      "data-tooltip-pos": "bottom",
    },
    options: [
      { id: "", name: opts.t9n.traitOstNone },
      { id: "organizationHeading", name: opts.t9n.traitOstOrganizationHeading },
      { id: "organization", name: opts.t9n.traitOstOrganization },
      { id: "introductionHeading", name: opts.t9n.traitOstIntroductionHeading },
      { id: "introduction", name: opts.t9n.traitOstIntroduction },
      { id: "descriptionHeading", name: opts.t9n.traitOstDescriptionHeading },
      { id: "description", name: opts.t9n.traitOstDescription },
      { id: "tasksHeading", name: opts.t9n.traitOstTasksHeading },
      { id: "tasks", name: opts.t9n.traitOstTasks },
      { id: "requirementsHeading", name: opts.t9n.traitOstRequirementsHeading },
      { id: "requirements", name: opts.t9n.traitOstRequirements },
      { id: "benefitsHeading", name: opts.t9n.traitOstBenefitsHeading },
      { id: "benefits", name: opts.t9n.traitOstBenefits },
      { id: "contactHeading", name: opts.t9n.traitOstContactHeading },
      { id: "contact", name: opts.t9n.traitOstContact },
      { id: "calltoaction", name: opts.t9n.traitOstCallToAction },
    ],
  };
  // Define ostendis type trait for images
  const ostTypeImageTrait = {
    type: "ost-blocks-select",
    label: "Ostendis Blocks",
    name: "data-ost-type",
    attributes: {
      "data-tooltip": opts.t9n.traitBlkOstendisTooltip,
      "data-tooltip-pos": "bottom",
    },
    options: [
      { id: "", name: opts.t9n.traitOstNone },
      { id: "logoPicURL", name: opts.t9n.traitOstLogoPicURL },
      { id: "headerPic1URL", name: opts.t9n.traitOstHeaderPic1URL },
      { id: "headerPic2URL", name: opts.t9n.traitOstHeaderPic2URL },
      { id: "headerPic3URL", name: opts.t9n.traitOstHeaderPic3URL },
      { id: "footerPic1URL", name: opts.t9n.traitOstFooterPic1URL },
      { id: "footerPic2URL", name: opts.t9n.traitOstFooterPic2URL },
      { id: "footerPic3URL", name: opts.t9n.traitOstFooterPic3URL },
      { id: "additionalPic1URL", name: opts.t9n.traitOstAdditionalPic1URL },
      { id: "additionalPic2URL", name: opts.t9n.traitOstAdditionalPic2URL },
      { id: "additionalPic3URL", name: opts.t9n.traitOstAdditionalPic3URL },
    ],
  };
  // Define ostendis type "hide in simple html"
  const ostTypeHideInSimpleHtmlTrait = {
    type: "checkbox",
    label: opts.t9n.hideInSimpleHtmlLabel,
    name: "data-ost-simple-hide",
    attributes: {
      "data-tooltip": opts.t9n.hideInSimpleHtmlTooltip,
      "data-tooltip-pos": "bottom",
    },
    valueTrue: "1",
    valueFalse: "",
  };
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
          ostTypeHideInSimpleHtmlTrait,
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
        traits: ["id", "title", ostTypeTextTrait],
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
        traits: ["id", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
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
        traits: [
          {
            type: "select",
            label: "Icon",
            name: "class",
            attributes: {
              id: "select-fontawesome",
              "data-tooltip": opts.t9n.labelIconTooltip,
              "data-tooltip-pos": "bottom",
            },
            options: [
              { id: "fas fa-minus", name: opts.t9n.labelIconSelectMinus },
              { id: "fas fa-circle", name: opts.t9n.labelIconSelectCircleSolid },
              { id: "far fa-circle", name: opts.t9n.labelIconSelectCircle },
              { id: "fas fa-check", name: opts.t9n.labelIconSelectCheck },
              { id: "fas fa-square", name: opts.t9n.labelIconSelectSquare },
              { id: "fas fa-arrow-right", name: opts.t9n.labelIconSelectArrowRight },
              { id: "fas fa-check-circle", name: opts.t9n.labelIconSelectCheckCircle },
              { id: "far fa-clock", name: opts.t9n.labelIconSelectClock },
              { id: "fas fa-percent", name: opts.t9n.labelIconSelectPercent },
              { id: "far fa-building", name: opts.t9n.labelIconSelectBuilding },
              { id: "fas fa-home", name: opts.t9n.labelIconSelectHome },
              { id: "fas fa-globe", name: opts.t9n.labelIconSelectGlobe },
              { id: "far fa-file", name: opts.t9n.labelIconSelectFile },
              { id: "fas fa-utensils", name: opts.t9n.labelIconSelectUtensils },
              { id: "far fa-calendar-alt", name: opts.t9n.labelIconSelectCalendar },
              { id: "far fa-hourglass", name: opts.t9n.labelIconSelectHourglass },
              { id: "fas fa-map-marker-alt", name: opts.t9n.labelIconSelectMapMarker },
              { id: "fas fa-road", name: opts.t9n.labelIconSelectRoad },
              { id: "fas fa-coffee", name: opts.t9n.labelIconSelectCoffee },
              { id: "fas fa-phone", name: opts.t9n.labelIconSelectPhone },
              { id: "fas fa-envelope", name: opts.t9n.labelIconSelectEnvelope },
              { id: "fas fa-star", name: opts.t9n.labelIconSelectStar },
            ],
          },
          ostTypeHideInSimpleHtmlTrait,
        ],
      },
    },
  });
  // Add ostendis type trait to table components
  DomComponents.addType("table", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
  // Add ostendis type trait to link components
  DomComponents.addType("link", {
    model: {
      defaults: {
        traits: ["id", "href", "target", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
  // Add ostendis type trait to image components
  DomComponents.addType("image", {
    model: {
      defaults: {
        traits: ["alt", ostTypeImageTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
  // Add ostendis type trait to text components
  DomComponents.addType("textnode", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
  // Add ostendis type trait to text components
  DomComponents.addType("text", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
  // Add ostendis type trait to default components
  DomComponents.addType("default", {
    model: {
      defaults: {
        traits: ["id", ostTypeTextTrait, ostTypeHideInSimpleHtmlTrait],
      },
    },
  });
};
