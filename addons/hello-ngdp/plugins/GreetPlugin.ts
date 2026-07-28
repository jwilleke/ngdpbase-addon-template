/**
 * GreetPlugin — renders [{Greet}] on any wiki page.
 */

interface PluginContext {
  engine?: { getManager(name: string): unknown };
  pageName?: string;
}

const GreetPlugin = {
  name: 'Greet',
  description: 'Hello Ngdp — Greet plugin',
  author: 'ngdpbase',
  version: '1.0.0',

  /**
   * Params arrive as a plain object of the attributes written in the markup.
   * Return a STRING of HTML — returning a Promise is fine, the renderer awaits.
   */
  execute(context: PluginContext, params: Record<string, string>): string {
    const label = params.label ?? 'Hello Ngdp';
    // Escape anything that reaches the page — params are author-controlled but
    // a plugin that interpolates raw input teaches the wrong pattern.
    const safe = String(label).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c] as string));
    return `<div class="hello-ngdp-greet">${safe}</div>`;
  }
};

export default GreetPlugin;
