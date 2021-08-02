// TODO: remove underscore and use private class field when supported in Firefox
/* eslint-disable no-underscore-dangle */
import AudioPlayer from './audioPlayer.js';

/**
 * This class is responsible for managing the time intervals of playing audio files.
 */
export default class AudioOrchestrator {
  _SECONDS_IN_MIN = 60;

  _MILLISECONDS_IN_SECOND = 1000;

  notifyDurationInMinutes = 20;

  _audioPlayer;

  intervalId;

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
    // pass the ready-to-be used audio player to the constructor
    return new this(this._audioPlayer);
  }

  get notifyDurationInMinutes() {
    return this.notifyDurationInMinutes;
  }

  set notifyDurationInMinutes(notifyDurationInMinutes) {
    if (notifyDurationInMinutes < 0) {
      throw new Error('Invalid duration, please set a duration greater or equal to 0');
    }
    this.notifyDurationInMinutes = notifyDurationInMinutes;
  }

  get intervalId() {
    return this.intervalId;
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
        this.intervalId = setInterval(
          async () => {
            // decorates play method with logging
            await this._audioPlayer.playAudio();
            console.info(`Triggered at ${new Date().toISOString()}`);
            const currentTimestamp = new Date().getTime();
            const nextNotifyTimestamp = currentTimestamp
              + this.notifyDurationInMinutes
              * this._SECONDS_IN_MIN
              * this._MILLISECONDS_IN_SECOND;
            // TODO: send next notify timestamp to popup
            console.info(`Next trigger at ${new Date(nextNotifyTimestamp).toISOString()}`);

            // after the audio file is played, it is susceptible to garbage
            // collection, so we re-create the file so that it is ready for
            // playback in the next interval
            await this._audioPlayer.restart();
          },
          this.notifyDurationInMinutes
          * this._SECONDS_IN_MIN
          * this._MILLISECONDS_IN_SECOND,
        );
        console.log(this.intervalId);
        resolve(this.intervalId);
      } else {
        reject(new Error('Audio is not ready'));
      }
    });
  }

  /**
   * Stops playing the sound at each interval.
   */
  stopSoundInterval() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
