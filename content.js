const synth = window.speechSynthesis;

const DEFAULT_CONFIG = {
  enabled: true
};

const currState = {
  target: null,
  utterance: null
};

const clearState = () => {
  currState.target.style.background = "";
  currState.target = null;
  currState.utterance = null;
  currState.utterance?.removeEventListener("end");
}

document.addEventListener('keydown', async (event) => {
  if (event.key === 'Escape') {
    synth.cancel();
    if (currState?.utterance) {
      clearState();
    }
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

const readSingleElement = (element) => {
  currState.target = element;
  const text = element.textContent
  currState.utterance = new SpeechSynthesisUtterance(text);
  currState.target.style.background = "rgba(255, 255, 0, .3)";
  currState.utterance.addEventListener("end", clearState)
  synth.speak(currState.utterance);
};

const readContinuous = (firstElement) => {
  if (currState?.utterance) {
    currState.utterance.removeEventListener("end");
  }
  currState.target = firstElement;
  const text = firstElement.textContent
  currState.utterance = new SpeechSynthesisUtterance(text);
  currState.target.style.background = "rgba(255, 255, 0, .3)";
  currState.utterance.addEventListener("end", () => {
    const prevTarget = currState.target;
    currState.target.style.background = "";
    currState.target = null;
    currState.utterance = null;
    readContinuous(prevTarget.nextElementSibling);
  });
  synth.speak(currState.utterance);
};

document.addEventListener('click', async (event) => {
  if (event?.target?.textContent && event.altKey) {
    const config = await getConfig();
    if (!synth.speaking && config.enabled) {
      if (event.shiftKey) {
        readContinuous(event.target);
      } else {
        readSingleElement(event.target);
      }
    }
  }
});

