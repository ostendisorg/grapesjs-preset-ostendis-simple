import type { Editor } from "grapesjs";
import { PluginOptions } from ".";

export default async (editor: Editor, opts: Required<PluginOptions>) => {
    const { RichTextEditor } = editor;
  
    RichTextEditor.add("removeFormat", {
      icon: '<i class="fa-solid fa-text-slash"></i>',
      attributes: { title: "Remove format" },
  
      result: rte => rte.exec("removeFormat"),
    });
};
