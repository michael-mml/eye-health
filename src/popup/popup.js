// the below ESLint comment states the code relies on the browser global variable
/* global browser */

// this module is executed when the popup is visible (i.e. whenever the icon is
// clicked) and acts as the frontend/client of the extension
import status from '../model/model.js';

const {
  START,
  RESTART,
  STOP,
  STATUS,
} = status;

const setPopupExtensionToggle = async () => {
  try {
    // get status from "backend"
    const {
      soundIntervalId,
    } = await browser.runtime.sendMessage(
      {
        type: STATUS,
      },
    );
    document.querySelector('#extension-control').innerHTML = (soundIntervalId != null)
      ? 'Click to turn OFF'
      : 'Click to turn ON';
    document.querySelector('#extension-control').value = (soundIntervalId != null);
  } catch (err) {
    console.error(err);
  }
};

const showDurationControls = async () => {
  try {
    // get status from "backend"
    const {
      soundIntervalId,
    } = await browser.runtime.sendMessage(
      {
        type: STATUS,
      },
    );
    document.querySelector('.duration').style.display = (soundIntervalId != null)
      ? 'block'
      : 'none';
    document.querySelector('#timer').style.display = (soundIntervalId != null)
      ? 'inline'
      : 'none';
  } catch (err) {
    console.error(err);
  }
};

const setDurationControl = async () => {
  try {
    // get status from "backend"
    const {
      notifyDurationInMinutes,
    } = await browser.runtime.sendMessage(
      {
        type: STATUS,
      },
    );
    document.querySelector('#duration-control').value = notifyDurationInMinutes;
    document.querySelector('#duration-display').innerHTML = notifyDurationInMinutes;
  } catch (err) {
    console.error(err);
  }
};

const onclickExtensionToggle = async () => {
  // precondition: extension starts as enabled
  const extensionControlButton = document.querySelector('#extension-control');
  const isExtensionOnBeforeClick = extensionControlButton.value === 'true';
  const isExtensionOnAfterClick = !isExtensionOnBeforeClick;
  extensionControlButton.value = isExtensionOnAfterClick;
  extensionControlButton.innerHTML = isExtensionOnAfterClick ? 'Click to turn ON' : 'Click to turn OFF';

  if (!isExtensionOnAfterClick) {
    await browser.runtime.sendMessage(
      {
        type: STOP,
      },
    );
  } else {
    const notifyDurationControlInput = document.querySelector('#duration-control');

    try {
      const startResponse = await browser.runtime.sendMessage(
        {
          type: START,
          payload: {
            notifyDuration: notifyDurationControlInput.value,
          },
        },
      );
      console.log(startResponse);
    } catch (err) {
      console.error(err);
    }
  }

  await setPopupExtensionToggle();
  // hide duration controls if the extension is off
  await showDurationControls();
};

// TODO: debounce the slider input
const oninputNotifyDuration = async () => {
  const notifyDurationControlInput = document.querySelector('#duration-control');

  // update display of how long the duration is set to
  document.querySelector('#duration-display').innerHTML = notifyDurationControlInput.value;

  // TODO: save duration to storage using storage.StorageArea?

  try {
    const {
      notifyDurationInMinutes,
    } = await browser.runtime.sendMessage(
      {
        type: RESTART,
        payload: {
          notifyDuration: notifyDurationControlInput.value,
        },
      },
    );
    document.querySelector('#duration-control').value = notifyDurationInMinutes;
  } catch (err) {
    console.error(err);
  }
};

(async function init() {
  await showDurationControls();
  await setPopupExtensionToggle();
  await setDurationControl();

  document.querySelector('#extension-control').onclick = onclickExtensionToggle;
  document.querySelector('#duration-control').oninput = oninputNotifyDuration;
}());
