/**
 * Hello Ngdp addon for ngdpbase.
 *
 * Configuration keys (in app-custom-config.json):
 *   ngdpbase.addons.hello-ngdp.enabled   — true/false (REQUIRED; defaults to false)
 *   ngdpbase.addons.hello-ngdp.dataPath  — override the data directory
 *
 * The exported `name` below MUST equal the `ngdpbase.slug` in package.json.
 * AddonsManager treats the manifest slug as authoritative and warns loudly on a
 * mismatch, because the config key follows the slug, not this label (#927).
 */

import path from 'path';
import { fileURLToPath } from 'url';
import GreeterDataManager from './managers/GreeterDataManager.js';
import GreetPlugin from './plugins/GreetPlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Engine {
  getManager<T = unknown>(name: string): T | null;
  registerManager(name: string, manager: unknown): void;
  app?: { use(route: string, handler: unknown): void };
}

const HelloNgdpAddon = {
  name: 'hello-ngdp',
  version: '1.0.0',
  description: 'Hello Ngdp addon for ngdpbase',
  author: 'ngdpbase',
  dependencies: [] as string[],

  async register(engine: Engine, config: Record<string, unknown>): Promise<void> {
    const cm = engine.getManager<{ resolveDataPath(n: string): string }>('ConfigurationManager');
    const dataPath = typeof config['dataPath'] === 'string' && config['dataPath'] !== ''
      ? config['dataPath'] as string
      : (cm?.resolveDataPath('hello-ngdp') ?? './data/hello-ngdp');

    const greeterdata = new GreeterDataManager(engine, dataPath);
    await greeterdata.load();
    engine.registerManager('GreeterDataManager', greeterdata);

    const pluginManager = engine.getManager<{
      registerPlugin(name: string, plugin: unknown): Promise<void>;
    }>('PluginManager');
    if (pluginManager) {
      await pluginManager.registerPlugin('Greet', GreetPlugin);
    }

    // Static assets, if this addon ships any under public/.
    // engine.app?.use('/addons/hello-ngdp', express.static(path.join(__dirname, 'public')));
    void __dirname;
  },

  /** Optional. Surfaced in the admin addon dashboard. */
  status(): { healthy: boolean } {
    return { healthy: true };
  }
};

export default HelloNgdpAddon;
