import juice from "juice";

export type OstTranslations = {
    [key: string]: string;
};

export default interface PluginOptions {
    /**
     * Which blocks to add.
     */
    blocks?: string[];
  
    /**
     * Add custom block options, based on block id.
     * @default (blockId) => ({})
     * @example (blockId) => blockId === 'quote' ? { attributes: {...} } : {};
     */
    block?: (blockId: string) => {};
  
    /**
     * Which OST blocks are in use.
     */
    usedOstBlockTypes?: string[];
  
    /**
     * Custom style for table blocks.
     */
    tableStyle?: Record<string, string>;
  
    /**
     * Custom style for table cell blocks.
     */
    cellStyle?: Record<string, string>;
  
    /**
     * Import command id.
     * @default 'gjs-open-import-template'
     */
    cmdOpenImport?: string;
  
    /**
     * Get inlined HTML command id.
     * @default 'gjs-get-inlined-html'
     */
    cmdInlineHtml?: string;
  
    /**
     * Title for the import modal.
     * @default 'Import template'
     */
    modalTitleImport?: string;
  
    /**
     * Title for the export modal.
     * @default 'Export template'
     */
    modalTitleExport?: string;
  
    /**
     * Label for the export modal.
     * @default ''
     */
    modalLabelExport?: string;
  
    /**
     * Label for the import modal.
     * @default ''
     */
    modalLabelImport?: string;
  
    /**
     * Label for the import button.
     * @default 'Import'
     */
    modalBtnImport?: string;
  
    /**
     * Label for the Trait.
     * @default ''
     */
    traitBlkValue?: string;
  
    /**
     * Template as a placeholder inside import modal.
     * @default ''
     */
    importPlaceholder?: string;
  
    /**
     * If `true`, inlines CSS on export.
     * @default true
     */
    inlineCss?: boolean;
  
    /**
     * Update Style Manager with more reliable style properties to use for newsletters.
     * @default true
     */
    updateStyleManager?: boolean;
  
    /**
     * Show the Style Manager on component change.
     * @default true
     */
    showStylesOnChange?: boolean;
  
    /**
     * Show the Block Manager on load.
     * @default true
     */
    showBlocksOnLoad?: boolean;
  
    /**
     * Show the Traits Manager on load.
     * @default true
     */
    showTraitsOnLoad?: boolean;
  
    /**
     * Show the outline option on load.
     * @default true
     */
    showOutlineOnLoad?: boolean;
  
    /**
     * Code viewer theme.
     * @default 'hopscotch'
     */
    codeViewerTheme?: string;
  
    /**
     * Custom options for `juice` HTML inliner.
     * @default {}
     */
    juiceOpts?: juice.Options;
  
    /**
     * Toolbar clone.
     * @default 'Clone list element'
     */
    ostToolbarClone?: string;
  
    /**
     * Toolbar delete.
     * @default 'Delete list element'
     */
    ostToolbarDelete?: string;
  
    /**
     * Toolbar up.
     * @default 'Move list element up'
     */
    ostToolbarUp?: string;
  
    /**
     * Toolbar down.
     * @default 'Move list element down'
     */
    ostToolbarDown?: string;
  
    /**
     * Toolbar down.
     * @default 'View components'
     */
    cmdBtnDesktopLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Desktop'
     */
    cmdBtnTabletLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Tablet'
     */
    cmdBtnMobileLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Mobile'
     */
    cmdBtnViewCompLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Undo'
     */
    cmdBtnUndoLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Redo'
     */
    cmdBtnRedoLabel?: string;
  
    /**
     * Toolbar down.
     * @default 'Open Parameter'
     */
    openTmBtnTitle?: string;

    /**
     * Ostendis translations
     */
    t9n?: OstTranslations;
}
