import PluginOptions from "./pluginOptions";

export const cmdDeviceDesktop = "set-device-desktop";
export const cmdDeviceTablet = "set-device-tablet";
export const cmdDeviceMobile = "set-device-mobile";

// Define ostendis type trait for text and default components
export function ostTypeTextTrait(opts: Required<PluginOptions>) {
  return {
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
}
// Define ostendis type trait for images
export function ostTypeImageTrait(opts: Required<PluginOptions>) {
  return {
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
}
// Define ostendis type "hide in simple html"
export function ostTypeHideInSimpleHtmlTrait(opts: Required<PluginOptions>) {
  return {
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
}
// Define ostendis type trait for icons
export function iconTrait(opts: Required<PluginOptions>) {
  return {
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
  };
}
