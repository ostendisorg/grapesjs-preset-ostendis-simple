import type {Component, Plugin} from "grapesjs";
import loadBlocks from "./blocks";
import loadCommands from "./commands";
import loadPanels from "./panels";
import loadTraits from "./traits";
import loadComponents from "./components";
import loadRte from "./rte";
import PluginOptions from "./pluginOptions";
import {ostTrans} from "./ostTranslations";

export type RequiredPluginOptions = Required<PluginOptions>;

type ToolbarButton = {
    attributes?: {
        class?: string;
        "data-tooltip"?: string;
        "data-tooltip-pos"?: "bottom",
    };
    label?: string;
    command: string;
};

const plugin: Plugin<PluginOptions> = async (
    editor,
    opts: Partial<PluginOptions> = {}
) => {
    let config = editor.getConfig();

    const options: RequiredPluginOptions = {
        blocks: [],
        block: () => ({}),
        usedOstBlocks: [],
        cmdOpenImport: "gjs-open-import-template",
        codeViewerTheme: "hopscotch",
        inlineCss: true,
        showStylesOnChange: true,
        showTraitsOnLoad: true,
        showOutlineOnLoad: true,
        t9n: ostTrans,
        ...opts,
    };

    // Change some config
    config.devicePreviewMode = true;

    loadComponents(editor, options);
    loadTraits(editor, options);
    await loadCommands(editor, options);
    loadBlocks(editor, options);
    loadPanels(editor, options);
    await loadRte(editor, options);

    // On load
    editor.on("load", () => {
        // Create ostendis toolbar
        const tools = document.getElementById("gjs-tools");
        const ostTools = document.createElement("div");
        ostTools.classList.add("gjs-ost-toolbar");
        tools?.append(ostTools);
    });

    // On selected components
    editor.on("component:selected", () => {
        let selected = editor.getSelected();

        if (selected != undefined) {
            // Disable all actions for all components
            selected.set({
                draggable: false,
                removable: false,
                copyable: false,
            });

            if (selected.is("ulistitem")) {
                // LI itself - show only select-parent
                selected.set({
                    toolbar: [
                        {
                            attributes: {class: "fa-solid fa-arrow-up"},
                            command: "select-parent",
                        },
                    ],
                });
                showOstToolbar(selected);
            } else if (selected.isChildOf("ulistitem")) {
                // Content inside LI - show only select-parent
                const liContentToolbar: ToolbarButton[] = [
                    {
                        attributes: {class: "fa-solid fa-arrow-up"},
                        command: "select-parent",
                    },
                ];
                selected.set({
                    toolbar: liContentToolbar,
                });
                showOstToolbar(selected.closestType("ulistitem"));
            } else if (selected.getEl()?.tagName === "LI") {
                // Regular LI - show only select-parent
                selected.set({
                    toolbar: [
                        {
                            attributes: {class: "fa-solid fa-arrow-up"},
                            command: "select-parent",
                        },
                    ],
                });
                //If list element is empty replace with placeholder text (M&E case:)
                if (selected.components().length === 0 && !selected.get("content")) {
                    const selectedPosition = selected.index();
                    const newComponent = selected
                        .parent()
                        ?.append("<li>Text</li>", {at: selectedPosition});
                    selected.remove();
                    editor.select(newComponent);
                    selected = editor.getSelected();
                }
                showOstToolbar(selected);
            } else if (isChildOfElement(selected.getEl(), "LI")) {
                // Content inside regular LI - show only select-parent
                const liContentToolbar: ToolbarButton[] = [
                    {
                        attributes: {class: "fa-solid fa-arrow-up"},
                        command: "select-parent",
                    },
                ];
                selected.set({
                    toolbar: liContentToolbar,
                });
                showOstToolbar(selected.closest("li"));
            } else if (selected.getEl()?.tagName === "UL") {
                // UL is selected - show paste button first, select-parent at the end
                const ulToolbar: ToolbarButton[] = [
                    {
                        attributes: {
                            class: "fa-solid fa-file-word",
                            "data-tooltip": options.t9n.ostToolbarPasteFromWord,
                            "data-tooltip-pos": "bottom"
                        },
                        command: "paste-from-word",
                    },
                    {
                        label: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"></path></svg>',
                        command: "select-parent",
                    },
                ];

                selected.set({
                    toolbar: ulToolbar,
                });

                // Hide OST toolbar for UL elements
                const ostToolbar = document.querySelector(".gjs-ost-toolbar");
                ostToolbar?.classList.remove("show");
            } else {
                // For other elements, show default toolbar with only select-parent
                const defaultToolbar: ToolbarButton[] = [
                    {
                        label: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z"></path></svg>',
                        command: "select-parent",
                    },
                ];

                selected.set({
                    toolbar: defaultToolbar,
                });

                // Hide OST toolbar for other elements
                const ostToolbar = document.querySelector(".gjs-ost-toolbar");
                ostToolbar?.classList.remove("show");
            }
        }
    });

    // On deselected components
    editor.on("component:deselected", () => {
        const ostToolbar = document.querySelector(".gjs-ost-toolbar");
        ostToolbar?.classList.remove("show");
    });

    function isChildOfElement(element: HTMLElement | undefined, tag: string) {
        while (element?.parentNode) {
            element = element.parentNode as HTMLElement;
            if (element.tagName === tag) return element;
        }
        return false;
    }

    function showOstToolbar(listItem: Component | undefined) {
        const elPos = listItem?.index() || 0;
        const elLast = listItem?.parent()?.getLastChild().index();

        const ostToolbar = document.querySelector(".gjs-ost-toolbar") as HTMLElement;
        if (ostToolbar != undefined) {
            ostToolbar.innerHTML = "";

            // Add clone button
            const cBtn = document.createElement("div");
            cBtn.innerHTML =
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm-1.3 3.88h2.6v3.82h3.82v2.6H13.3v3.82h-2.6V13.3H6.88v-2.6h3.82z"/></svg>';
            cBtn.classList.add("gjs-ost-toolbar-item", "clone");
            cBtn.title = options.t9n.ostToolbarClone;
            cBtn.addEventListener("click", () => {
                listItem?.parent()?.append(listItem?.clone(), {at: elPos + 1});
            });
            ostToolbar.appendChild(cBtn);

            //Add delete button
            const dBtn = document.createElement("div");
            dBtn.innerHTML =
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm5.12 7.7v2.6H6.88v-2.6z"/></svg>';
            dBtn.title = options.t9n.ostToolbarDelete;
            dBtn.classList.add("gjs-ost-toolbar-item", "del");
            if (elLast != 0) {
                dBtn.addEventListener("click", () => {
                    listItem?.remove();
                    ostToolbar?.classList.remove("show");
                });
            } else {
                dBtn.classList.add("disable");
            }
            ostToolbar.appendChild(dBtn);

            // Add move up button
            const upBtn = document.createElement("div");
            upBtn.innerHTML =
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.9 20.75 12 3.25l10.1 17.5Z"/></svg>';
            upBtn.title = options.t9n.ostToolbarUp;
            upBtn.classList.add("gjs-ost-toolbar-item", "up");
            if (elPos > 0) {
                upBtn.addEventListener("click", () => {
                    if (elPos && listItem?.parent() != undefined) {
                        let parent = listItem.parent();
                        if (parent) {
                            listItem?.move(parent, {at: elPos - 1});
                        }
                        editor.selectRemove(listItem);
                        editor.select(listItem);
                    }
                });
            } else {
                upBtn.classList.add("disable");
            }
            ostToolbar.appendChild(upBtn);

            // Add move down button
            const dwnBtn = document.createElement("div");
            dwnBtn.innerHTML =
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22.4 3.25 12 20.75 1.6 3.25Z"/></svg>';
            dwnBtn.title = options.t9n.ostToolbarDown;
            dwnBtn.classList.add("gjs-ost-toolbar-item", "down");
            if (elPos != elLast) {
                let toPos = elPos + 2;
                if (elPos == elLast) {
                    toPos = 0;
                }
                dwnBtn.addEventListener("click", () => {
                    if (toPos && listItem?.parent() != undefined) {
                        let parent = listItem.parent();
                        if (parent) {
                            listItem.move(parent, {at: toPos});
                        }
                        editor.selectRemove(listItem);
                        editor.select(listItem);
                    }
                });
            } else {
                dwnBtn.classList.add("disable");
            }
            ostToolbar.appendChild(dwnBtn);

            // Add show
            ostToolbar.classList.add("show");
        }
    }
};

export default plugin;
