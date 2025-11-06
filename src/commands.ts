import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import { BULLET_PATTERNS, cmdDeviceDesktop, cmdDeviceMobile, cmdDeviceTablet } from "./consts";

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
        return BULLET_PATTERNS.some(pattern => pattern.test(trimmedLine));
    }

    // Helper function to remove bullet point markers
    function removeBulletPoint(line: string): string {
        let trimmedLine = line.trim();

        for (const pattern of BULLET_PATTERNS) {
            trimmedLine = trimmedLine.replace(pattern, '');
        }

        return trimmedLine.trim() || 'Text';
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
                <div>
                    <p id="paste-from-word-text">${opts.t9n.labelPasteFromWordText}</p>
                    <textarea id="paste-from-word-content" placeholder="${opts.t9n.labelPasteFromWordPlaceholder}"></textarea>
                    <div id="paste-from-word-footer">
                        <button id="paste-from-word-apply">${opts.t9n.labelPasteFromWordButton}</button>
                    </div>
                </div>
            `;

            modal.setTitle(opts.t9n.labelPasteFromWord);
            modal.setContent(modalContent);
            modal.open();

            setTimeout(() => {
                const textarea = document.getElementById('paste-from-word-content') as HTMLTextAreaElement;
                const applyBtn = document.getElementById('paste-from-word-apply');

                if (textarea) {
                    textarea.focus();
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
                            modal.close();
                        }
                    });
                }
            }, 100);
        },
    });
};
