const synth = window.speechSynthesis;

const DEFAULT_CONFIG = {
  enabled: true
};

const currState = {
  target: null,
  utterance: null
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

// TODO: make it auto switch to next para

document.addEventListener('click', async (event) => {
  if (event?.target?.textContent && event.altKey) {
    const config = await getConfig();
    if (!synth.speaking && config.enabled) {
      currState.target = event.target;
      const text = event.target.textContent
      currState.utterance = new SpeechSynthesisUtterance(text);
      currState.target.style.background = "rgba(255, 255, 0, .3)";
      currState.utterance.addEventListener("end", () => {
        currState.target.style.background = "";
        currState.target = null;
        currState.utterance = null;
      })
      synth.speak(currState.utterance);
    }
  }
});

