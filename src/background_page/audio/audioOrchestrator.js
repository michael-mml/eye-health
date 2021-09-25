// TODO: remove underscore and use private class field when supported in Firefox
/* eslint-disable no-underscore-dangle */
import AudioPlayer from './audioPlayer.js';

// TODO: refactor these constants as class members once web-ext lint stops throwing errors
const _SECONDS_IN_MIN = 60;
const _MILLISECONDS_IN_SECOND = 1000;
const _DEFAULT_NOTIFY_DURATION_IN_MINS = 20;

/**
 * This class is responsible for managing the time intervals of playing audio files.
 */
export default class AudioOrchestrator {
  /**
   * Do not use, the static factory method is recommended instead.
   * Creates an instance of an AudioOrchestrator.
   *
   * @param {AudioPlayer} audioPlayer an {@link AudioPlayer} that has a ready-to-play audio file
   */
  constructor(audioPlayer) {
    if (!audioPlayer.isReady) {
      throw new Error('Audio player is not ready for playback, did you use the static factory method?');
    }
    this._audioPlayer = audioPlayer;
    this._notifyDurationInMinutes = _DEFAULT_NOTIFY_DURATION_IN_MINS;
  }

  /**
   * Creates an {@link AudioOrchestrator} that is ready to play some audio file repeatedly based on
   * some interval.
   *
   * @param {string} audioFileUrl the relative path to an audio file
   * @returns {AudioOrchestrator} an {@link AudioOrchestrator} that is ready to play audio
   */
  static async withSound(audioFileUrl) {
    // static factory method to asynchronously instantiate ready-to-play audio files
    this._audioPlayer = await AudioPlayer.withSoundReady(audioFileUrl);
    this._notifyDurationInMinutes = _DEFAULT_NOTIFY_DURATION_IN_MINS;
    // pass the ready-to-be used audio player to the constructor
    return new this(this._audioPlayer);
  }

  get notifyDurationInMinutes() {
    return this._notifyDurationInMinutes;
  }

  set notifyDurationInMinutes(duration = _DEFAULT_NOTIFY_DURATION_IN_MINS) {
    if (duration < 0) {
      throw new Error('Invalid duration, please set a duration greater or equal to 0');
    }
    this._notifyDurationInMinutes = duration;
  }

  get intervalId() {
    return this._intervalId;
  }

  /**
   * Plays a sound every interval according to `this.notifyDurationInMinutes` and returns the
   * intervalId.
   *
   * @returns {Promise<number>} a Promise that resolves with the intervalId of the setInterval call
   */
  playSoundEveryInterval() {
    return new Promise((resolve, reject) => {
      if (this._audioPlayer.isReady) {
        this._intervalId = setInterval(
          async () => {
            // decorates play method with logging
            await this._audioPlayer.playAudio();
            console.info(`Triggered at ${new Date().toISOString()}`);
            const currentTimestamp = new Date().getTime();
            const nextNotifyTimestamp = currentTimestamp
              + this._notifyDurationInMinutes
              * _SECONDS_IN_MIN
              * _MILLISECONDS_IN_SECOND;
            // TODO: send next notify timestamp to popup
            console.info(`Next trigger at ${new Date(nextNotifyTimestamp).toISOString()}`);

            // after the audio file is played, it is susceptible to garbage
            // collection, so we re-create the file so that it is ready for
            // playback in the next interval
            await this._audioPlayer.restart();
          },
          this._notifyDurationInMinutes
          * _SECONDS_IN_MIN
          * _MILLISECONDS_IN_SECOND,
        );
        console.log(this._intervalId);
        resolve(this._intervalId);
      } else {
        reject(new Error('Audio is not ready'));
      }
    });
  }

  /**
   * Stops playing the sound at each interval.
   */
  stopSoundInterval() {
    clearInterval(this._intervalId);
    this._intervalId = null;
  }
}
