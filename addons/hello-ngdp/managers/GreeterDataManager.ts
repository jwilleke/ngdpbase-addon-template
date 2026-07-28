/**
 * GreeterDataManager — data layer for the hello-ngdp addon.
 *
 * Registered on the engine as 'GreeterDataManager' during register(), so other
 * addons and plugins reach it with engine.getManager('GreeterDataManager').
 */

export default class GreeterDataManager {
  private records: unknown[] = [];

  constructor(private engine: unknown, private dataPath: string) {}

  /** Called once during register(). Load persisted state here. */
  async load(): Promise<void> {
    // Replace with real loading. dataPath is resolved by the addon's
    // register() via ConfigurationManager.resolveDataPath, so it already
    // respects the instance's data directory.
    this.records = [];
  }

  list(): unknown[] {
    return this.records;
  }

  /** Surfaced in the admin addon dashboard. */
  status(): { healthy: boolean; records: number } {
    return { healthy: true, records: this.records.length };
  }
}
