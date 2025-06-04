import { Plugin } from "grapesjs";

export interface PluginOptions {
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
   * Import command id.
   * @default 'gjs-open-import-template'
   */
  cmdOpenImport?: string;
  /**
   * If `true`, inline CSS on export.
   * @default true
   */
  inlineCss?: boolean;
  /**
   * Show the Style Manager on component change.
   * @default true
   */
  showStylesOnChange?: boolean;
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
   * Ostendis translations
   */
  t9n?: OstTranslations;
  /**
   * Ostendis blocks
   */
  usedOstBlocks?: {
    name: string;
    count: number;
  }[];
}
export type OstTranslations = {
  [key: string]: string;
};
export type RequiredPluginOptions = Required<PluginOptions>;
declare const plugin: Plugin<PluginOptions>;

export { plugin as default };

export {};
