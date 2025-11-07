import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import { cmdDeviceDesktop, cmdDeviceMobile, cmdDeviceTablet } from "./consts";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { Panels } = editor;
  const openTraits = "open-tm";
  const activateOutline = "sw-visibility";

  // Turn off default devices select and create new one
  editor.getConfig().showDevices = false;

  Panels.getPanels().reset([
    {
      id: "commands",
      buttons: [{}],
    },
    {
      id: "devices-c",
      buttons: [
        {
          id: cmdDeviceDesktop,
          command: cmdDeviceDesktop,
          className: "fa-solid fa-desktop",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnDesktopLabel,
            "data-tooltip-pos": "bottom",
          },
          active: true,
        },
        {
          id: cmdDeviceTablet,
          command: cmdDeviceTablet,
          className: "fa-solid fa-tablet-screen-button",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnTabletLabel,
            "data-tooltip-pos": "bottom",
          },
        },
        {
          id: cmdDeviceMobile,
          command: cmdDeviceMobile,
          className: "fa-solid fa-mobile-screen-button",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnMobileLabel,
            "data-tooltip-pos": "bottom",
          },
        },
      ],
    },
    {
      id: "options",
      buttons: [
        {
          id: activateOutline,
          command: activateOutline,
          context: activateOutline,
          className: "fa-solid fa-border-none",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnViewCompLabel,
            "data-tooltip-pos": "bottom",
          },
        },
        {
          id: "undo",
          command: "core:undo",
          className: "fa-solid fa-rotate-left",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnUndoLabel,
            "data-tooltip-pos": "bottom",
          },
        },
        {
          id: "redo",
          command: "core:redo",
          className: "fa-solid fa-rotate-right",
          attributes: {
            "data-tooltip": opts.t9n.cmdBtnRedoLabel,
            "data-tooltip-pos": "bottom",
          },
        },
      ],
    },
    {
      id: "views",
      buttons: [
        {
          id: openTraits,
          command: openTraits,
          togglable: false,
          className: "fa-solid fa-gear",
          attributes: {
            "data-tooltip": opts.t9n.openTraits,
            "data-tooltip-pos": "bottom",
          },
        },
      ],
    },
  ]);

  // Do stuff on load
  editor.onReady(() => {
    if (opts.showOutlineOnLoad) {
      const btn = Panels.getButton("options", activateOutline);
      btn?.set("active", true);
    }

    if (opts.showTraitsOnLoad) {
      const btn = Panels.getButton("views", openTraits);
      btn?.set("active", true);
    }
    //Beautify tooltips
    document.querySelectorAll("*[data-tooltip-pos]").forEach((el) => {
      const title = el.getAttribute("title")?.trim();
      if (title) {
        el.setAttribute("data-tooltip", title);
        el.removeAttribute("title");
      }
    });
  });
};
