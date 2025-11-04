import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import { cmdDeviceDesktop, cmdDeviceMobile, cmdDeviceTablet } from "./consts";

export default async (editor: Editor, opts: Required<PluginOptions>) => {
    const { Commands } = editor;

    Commands.add(cmdDeviceDesktop, {
        run: (ed) => ed.setDevice("Desktop"),
        stop: () => {},
    });

    Commands.add(cmdDeviceTablet, {
        run: (ed) => ed.setDevice("Tablet"),
        stop: () => {},
    });

    Commands.add(cmdDeviceMobile, {
        run: (ed) => ed.setDevice("Mobile portrait"),
        stop: () => {},
    });

    // Helper function to check if a line is a bullet point
    function isBulletPoint(line: string): boolean {
        const trimmedLine = line.trim();

        // Check for various bullet point patterns
        const bulletPatterns = [
            /^[•·▪▫‣⁃◦‧⦿⦾]/,
            /^[-*+]\s+/,
            /^\d+[.)]\s+/,
            /^[a-zA-Z][.)]\s+/,
            /^[ivxlcdm]+[.)]\s+/i,
            /^§\s+/,
            /^►\s+/,
            /^○\s+/,
            /^●\s+/,
            /^■\s+/,
            /^□\s+/,
            /^✓\s+/,
            /^✗\s+/,
            /^&bull;\s*/,
            /^&middot;\s*/,
            /^&#8226;\s*/,
            /^&#8227;\s*/,
            /^&#8259;\s*/,
            /^&#9675;\s*/,
            /^&#9679;\s*/,
        ];

        return bulletPatterns.some(pattern => pattern.test(trimmedLine));
    }

    // Helper function to remove bullet point markers
    function removeBulletPoint(line: string): string {
        const trimmedLine = line.trim();

        let cleaned = trimmedLine
            .replace(/^[•·▪▫‣⁃◦‧⦿⦾]\s*/, '')
            .replace(/^[-*+]\s+/, '')
            .replace(/^\d+[.)]\s+/, '')
            .replace(/^[a-zA-Z][.)]\s+/, '')
            .replace(/^[ivxlcdm]+[.)]\s+/i, '')
            .replace(/^§\s+/, '')
            .replace(/^►\s+/, '')
            .replace(/^○\s+/, '')
            .replace(/^●\s+/, '')
            .replace(/^■\s+/, '')
            .replace(/^□\s+/, '')
            .replace(/^✓\s+/, '')
            .replace(/^✗\s+/, '')
            .replace(/^&bull;\s*/, '')
            .replace(/^&middot;\s*/, '')
            .replace(/^&#8226;\s*/, '')
            .replace(/^&#8227;\s*/, '')
            .replace(/^&#8259;\s*/, '')
            .replace(/^&#9675;\s*/, '')
            .replace(/^&#9679;\s*/, '')
            .trim();

        return cleaned || 'Text';
    }

    // Helper function to clean individual item content
    function cleanItemContent(content: string): string {
        content = content.replace(/<br\s*\/?>/gi, ' ');
        content = content.replace(/<[^>]+>/g, '');

        const entityMap: { [key: string]: string } = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': "'",
            '&nbsp;': ' ',
            '&#8226;': '•',
            '&#8227;': '‣',
            '&#8259;': '⁃',
            '&bull;': '•',
            '&middot;': '·'
        };

        for (const [entity, char] of Object.entries(entityMap)) {
            content = content.replace(new RegExp(entity, 'g'), char);
        }

        content = content.replace(/\s+/g, ' ').trim();

        if (!content || /^[•·▪▫‣⁃◦‧⦿⦾\-*+.()]+$/.test(content)) {
            content = 'Text';
        }

        return content;
    }

    // Helper function to clean Word content and convert to list items
    function cleanWordContentToListItems(content: string): string[] {
        content = content.replace(/<!--[\s\S]*?-->/g, '');
        content = content.replace(/<o:p\s*\/?>|<\/o:p>/gi, '');
        content = content.replace(/<w:[\s\S]*?>/gi, '');
        content = content.replace(/\s*mso-[^:]+:[^;"]*;?/gi, '');
        content = content.replace(/\s*class="[^"]*Mso[^"]*"/gi, '');
        content = content.replace(/<span[^>]*>\s*<\/span>/gi, '');
        content = content.replace(/<p[^>]*>/gi, '\n').replace(/<\/p>/gi, '');
        content = content.replace(/[ \t]+/g, ' ');
        content = content.replace(/\n\s+/g, '\n');
        content = content.trim();

        let items: string[] = [];

        if (content.includes('<li>') || content.includes('<LI>')) {
            const liMatches = content.match(/<li[^>]*>(.*?)<\/li>/gi);
            if (liMatches) {
                items = liMatches.map(li => {
                    const itemContent = li.replace(/<li[^>]*>|<\/li>/gi, '').trim();
                    return cleanItemContent(itemContent);
                });
            }
        } else {
            const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

            for (const line of lines) {
                if (isBulletPoint(line)) {
                    const itemContent = removeBulletPoint(line);
                    const cleaned = cleanItemContent(itemContent);
                    if (cleaned.trim().length > 0) {
                        items.push(cleaned);
                    }
                } else if (line.trim().length > 0) {
                    const cleaned = cleanItemContent(line);
                    if (cleaned.trim().length > 0) {
                        items.push(cleaned);
                    }
                }
            }
        }

        items = items.filter(item => item.trim().length > 0);
        if (items.length === 0) {
            items = ['Text'];
        }

        return items;
    }

    // Add Word paste command
    Commands.add("paste-from-word", {
        run(editor) {
            const selected = editor.getSelected();
            if (!selected) return;

            if (selected.getEl()?.tagName !== "UL") {
                console.warn("Paste from Word is only available for UL elements");
                return;
            }

      const modal = editor.Modal;
      const modalContent = `
        <div style="padding: 20px;">
          <h3 style="margin-top: 0; margin-bottom: 15px;">Paste List from Word</h3>
          <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
            Paste your list content from Word or other rich text editors below. 
            The formatting will be cleaned and converted to list items. This will replace all existing content in the list.
          </p>
          <textarea id="word-paste-content" 
                    placeholder="Paste your Word list content here..." 
                    style="width: 100%; height: 300px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 14px; line-height: 1.4; resize: vertical;"></textarea>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
            <button id="word-paste-cancel" 
                    style="padding: 10px 20px; background: #f8f9fa; color: #495057; border: 1px solid #dee2e6; border-radius: 4px; cursor: pointer; font-size: 14px;">
              Cancel
            </button>
            <button id="word-paste-apply" 
                    style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              Replace List Content
            </button>
          </div>
        </div>
      `;

      modal.setTitle('');  // Remove default title since we have a custom header
      modal.setContent(modalContent);
      modal.open();

            setTimeout(() => {
                const textarea = document.getElementById('word-paste-content') as HTMLTextAreaElement;
                const cancelBtn = document.getElementById('word-paste-cancel');
                const applyBtn = document.getElementById('word-paste-apply');

                if (textarea) {
                    textarea.focus();
                }

                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        modal.close();
                    });
                }

                if (applyBtn) {
                    applyBtn.addEventListener('click', () => {
                        if (textarea && selected) {
                            const content = textarea.value;
                            const listItems = cleanWordContentToListItems(content);

                            selected.components().reset();

                            selected.addAttributes({
                                'class': 'ulist fa-ul',
                                'style': 'padding: 0.2em 0; margin-left: 2em; line-height: 1.4em;'
                            });

                            listItems.forEach(itemContent => {
                                const liHtml = `<li class="ulistitem" style="text-align: left;"><span class="fa-li" style="left: -2em; width: 2em;"><i class="fas fa-circle" style="font-size: 0.4em; line-height: inherit; display: block;"></i></span><p style="margin: 0; padding: 0; text-align: left;">${itemContent}</p></li>`;
                                selected.append(liHtml);
                            });

                            modal.close();
                            editor.trigger('component:update', selected);
                        }
                    });
                }

                if (textarea) {
                    textarea.addEventListener('keydown', (e) => {
                        if (e.ctrlKey && e.key === 'Enter') {
                            applyBtn?.click();
                        } else if (e.key === 'Escape') {
                            cancelBtn?.click();
                        }
                    });
                }
            }, 100);
        },
    });
};