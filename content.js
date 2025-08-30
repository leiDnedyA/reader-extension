const synth = window.speechSynthesis;

const DEFAULT_CONFIG = {
  enabled: true
};

document.addEventListener('keydown', async (event) => {
  if (event.key === 'Escape') {
    synth.cancel();
  }
});

async function getConfig() {
  return new Promise((res, rej) => {
    chrome.storage.sync.get("config", ({ config }) => {
      if (config) {
        res({ ...DEFAULT_CONFIG, ...config });
      } else {
        res({ ...DEFAULT_CONFIG });
      }
    });
  })
}

document.addEventListener('click', async (event) => {
  if (event?.target?.textContent && event.altKey) {
    const config = await getConfig();
    if (!synth.speaking && config.enabled) {
      const text = event.target.textContent
      const utterance = new SpeechSynthesisUtterance(text);
      synth.speak(utterance);
    }
  }
});

