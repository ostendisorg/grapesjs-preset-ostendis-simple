import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default function (editor: Editor, opts: Required<PluginOptions>) {
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
}
