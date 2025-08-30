const DEFAULT_CONFIG = {
  enabled: true
};

const enabledCheckbox = document.querySelector('#tts-enabled');
let localConfig = {};

function renderUiFromConfig(config) {
  enabledCheckbox.checked = config.enabled;
}

window.onload = () => {
  chrome.storage.sync.get("config", ({ config }) => {
    localConfig = { ...DEFAULT_CONFIG, ...config };
    renderUiFromConfig(localConfig);
  });
}

enabledCheckbox.addEventListener('click', async (event) => {
  localConfig.enabled = event?.target?.checked;
  await chrome.storage.sync.set({ config: localConfig }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to save config:", chrome.runtime.lastError);
    }
  });
});

