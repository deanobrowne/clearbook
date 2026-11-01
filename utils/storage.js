// Storage utility for managing settings
const ClearbookStorage = {
  // Merge stored settings over defaults so missing keys (e.g. after an
  // update adds a new option) never come back undefined.
  withDefaults(stored) {
    const s = stored || {};
    const providers = { ...DEFAULT_SETTINGS.providers };
    for (const [name, defaults] of Object.entries(DEFAULT_SETTINGS.providers)) {
      providers[name] = { ...defaults, ...((s.providers || {})[name] || {}) };
    }
    return { ...DEFAULT_SETTINGS, ...s, providers };
  },

  // Get all settings
  async getSettings() {
    const result = await browser.storage.sync.get('settings');
    return this.withDefaults(result.settings);
  },

  // Save settings
  async saveSettings(settings) {
    await browser.storage.sync.set({ settings });
  },

  // Get a specific setting
  async getSetting(key) {
    const settings = await this.getSettings();
    return settings[key];
  },

  // Update a specific setting
  async updateSetting(key, value) {
    const settings = await this.getSettings();
    settings[key] = value;
    await this.saveSettings(settings);
  },

  // Get provider settings
  async getProviderSettings(provider) {
    const settings = await this.getSettings();
    return settings.providers[provider] || {};
  },

  // Update provider settings
  async updateProviderSettings(provider, providerSettings) {
    const settings = await this.getSettings();
    settings.providers[provider] = {
      ...settings.providers[provider],
      ...providerSettings
    };
    await this.saveSettings(settings);
  },

  // Get keyword blacklist
  async getKeywordBlacklist() {
    const settings = await this.getSettings();
    return settings.keywordBlacklist || [];
  },

  // Add keyword to blacklist
  async addKeyword(keyword) {
    const settings = await this.getSettings();
    if (!settings.keywordBlacklist.includes(keyword)) {
      settings.keywordBlacklist.push(keyword);
      await this.saveSettings(settings);
    }
  },

  // Remove keyword from blacklist
  async removeKeyword(keyword) {
    const settings = await this.getSettings();
    settings.keywordBlacklist = settings.keywordBlacklist.filter(k => k !== keyword);
    await this.saveSettings(settings);
  },

  // Reset to defaults
  async resetSettings() {
    await this.saveSettings(DEFAULT_SETTINGS);
  }
};
