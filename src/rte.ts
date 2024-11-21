import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default async (editor: Editor, opts: Required<PluginOptions>) => {
  const { RichTextEditor } = editor;

  RichTextEditor.add("removeFormat", {
    icon: '<i class="fa-solid fa-text-slash"></i>',
    attributes: { title: opts.t9n.cmdRteRemoveFormat },

    result: (rte) => rte.exec("removeFormat"),
  });
};
