import juice from "juice";

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
   * If `true`, inline CSS on export.
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
   * Ostendis translations
   */
  t9n?: OstTranslations;
}

export type OstTranslations = {
  [key: string]: string;
};
