/* eslint no-param-reassign: [
    "error", { "props": true, "ignorePropertyModificationsFor": ["audioOrchestrator"] }
  ]
*/
// below ESLint comment states the code relies on the browser global variable
/* global browser */

// this module is executed when the extension is installed and acts as the
// backend/server of the extension
import status from '../model/model.js';
import StatusResponse from '../model/statusResponse.js';
import StopResponse from '../model/stopResponse.js';
import StartResponse from '../model/startResponse.js';
import RestartResponse from '../model/restartResponse.js';
import AudioOrchestrator from './audio/audioOrchestrator.js';

/**
 * Listen to specific messages from the popup script.
 * See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#parameters on how to ignore messages.
 * This handler cannot be async because it will prevent other listeners from listening to messages.
 *
 * @param {AudioOrchestrator} audioOrchestrator an {@link AudioOrchestrator} with some audio file
 *                                              loaded
 * @returns {Promise<any> | false} a Promise if message is supposed to be handled, or false if the
 *                                 message is to be ignored
 */
const onMessageFromPopupScript = (audioOrchestrator) => (request) => {
  const {
    RESTART,
    START,
    STOP,
    STATUS,
  } = status;

  console.log(`Message from the popup script: ${JSON.stringify(request)}`);

  switch (request.type) {
    case START: {
      audioOrchestrator.stopSoundInterval();

      const { notifyDuration } = request.payload;
      audioOrchestrator.notifyDurationInMinutes = notifyDuration;

      return audioOrchestrator.playSoundEveryInterval()
        .then((soundIntervalId) => new StartResponse(soundIntervalId))
        .catch((err) => err);
    }
    // clear interval
    case STOP: {
      audioOrchestrator.stopSoundInterval();
      return Promise.resolve(new StopResponse(audioOrchestrator.intervalId));
    }
    // clear old interval and set new interval
    case RESTART: {
      audioOrchestrator.stopSoundInterval();

      const { notifyDuration } = request.payload;
      audioOrchestrator.notifyDurationInMinutes = notifyDuration;

      return audioOrchestrator.playSoundEveryInterval()
        // TODO: extract response object into a type definition in model/
        .then((soundIntervalId) => new RestartResponse(soundIntervalId, notifyDuration))
        .catch((err) => err);
    }
    // return whether or not there is an active setInterval
    case STATUS: {
      return Promise.resolve(new StatusResponse(audioOrchestrator.intervalId,
        audioOrchestrator.notifyDurationInMinutes));
    }
    // ignore messages of other types
    default: {
      return false;
    }
  }
};

(async function init() {
  // TODO: remove hardcoded audio path
  const audioOrchestrator = await AudioOrchestrator.withSound('../../resources/sounds/Ariel.ogg');
  // TODO: consider saving this state to storage
  await audioOrchestrator.playSoundEveryInterval();

  // TODO: open new tab every 20 mins

  // wait for popup to change settings
  browser.runtime.onMessage.addListener(
    onMessageFromPopupScript(
      audioOrchestrator,
    ),
  );
}());
