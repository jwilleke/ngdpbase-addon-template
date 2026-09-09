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
import { guardedFetch } from '../../dist/src/http/guardedFetch.js';
import { resolveEgressPolicy } from '../../dist/src/http/egressPolicy.js';
import apiRoutes from './routes/api.js';
import GreeterDataManager from './managers/GreeterDataManager.js';
import GreetPlugin from './plugins/GreetPlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Engine {
  getManager<T = unknown>(name: string): T | null;
  registerManager(name: string, manager: unknown): void;
  app?: {
    use(route: string, handler: unknown): void;
    get(setting: string): unknown;
    set(setting: string, value: unknown): void;
  };
}

const HelloNgdpAddon = {
  name: 'hello-ngdp',
  version: '1.0.0',
  description: 'Hello Ngdp addon for ngdpbase',
  author: 'ngdpbase',
  dependencies: [] as string[],

  async register(engine: Engine, config: Record<string, unknown>): Promise<void> {
    const cm = engine.getManager<{
      resolveDataPath(n: string): string;
      getProperty?(k: string, f?: unknown): unknown;
    }>('ConfigurationManager');

    // The ONE way this addon reaches the network (#1133): the host's guarded
    // fetch under the instance's egress policy, read per call so an operator
    // tightening it is honoured without a restart. The manager is handed this
    // and has no other door — see GreeterDataManager's constructor.
    const readConfig = (key: string, fallback?: unknown): unknown => cm?.getProperty?.(key, fallback) ?? fallback;
    const fetchJson = async (url: string): Promise<unknown> => {
      const { policy } = resolveEgressPolicy(readConfig);
      const res = await guardedFetch(url, { policy });
      if (res.status < 200 || res.status >= 300) throw new Error(`${url}: HTTP ${res.status}`);
      return JSON.parse(res.body.toString('utf8')) as unknown;
    };

    const dataPath = typeof config['dataPath'] === 'string' && config['dataPath'] !== ''
      ? config['dataPath'] as string
      : (cm?.resolveDataPath('hello-ngdp') ?? './data/hello-ngdp');

    const greeterdata = new GreeterDataManager(engine, dataPath, fetchJson);
    await greeterdata.load();
    engine.registerManager('GreeterDataManager', greeterdata);

    const pluginManager = engine.getManager<{
      registerPlugin(name: string, plugin: unknown): Promise<void>;
    }>('PluginManager');
    if (pluginManager) {
      await pluginManager.registerPlugin('Greet', GreetPlugin);
    }

    // Views render with the host's layout; routes mount under the addon's own
    // prefix. Appending to `views` rather than replacing it keeps the host's
    // own templates — header and footer included — resolvable.
    const views = (engine.app?.get('views') as string | string[] | undefined) ?? [];
    engine.app?.set('views', [...[views].flat(), path.join(__dirname, 'views')]);
    engine.app?.use('/api/hello-ngdp', apiRoutes(engine));

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
