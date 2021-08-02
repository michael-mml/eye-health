// TODO: remove underscore and use private class fields when supported in Firefox
/* eslint-disable no-underscore-dangle */

/**
 * This class is responsible for playing audio files at specified intervals.
 */
export default class AudioPlayer {
  _audioFileUrl;

  _notifySound;

  /**
   * Do not use, the static factory method is recommended instead.
   * Creates a new audio object for playback.
   *
   * @param {string} audioFileUrl the relative path to an audio file
   * @param {HTMLAudioElement} notifySound the audio file that is ready for playback
   */
  constructor(audioFileUrl, notifySound) {
    if (!(notifySound.readyState === HTMLAudioElement.HAVE_FUTURE_DATA
      || notifySound.readyState === HTMLAudioElement.HAVE_ENOUGH_DATA)) {
      throw new Error('Audio file is not ready for playback, did you use the static factory method?');
    }
    this._audioFileUrl = audioFileUrl;
    this._notifySound = notifySound;
  }

  /**
   * Creates an AudioPlayer with the specified file that is ready for playback
   * i.e. `canplaythrough` event has been fired once and `play` can be called
   * immediately.
   *
   * @param {string} audioFileUrl the relative path to an audio file
   * @returns {Promise<AudioPlayer>} an {@link AudioPlayer} with an audio file ready for playback
   */
  static async withSoundReady(audioFileUrl) {
    // static factory method to create an audio file and asynchronously wait until it is ready for
    // playback
    this._audioFileUrl = audioFileUrl;
    this._notifySound = new Audio(this._audioFileUrl);

    // wait for the canplaythrough event on the audio file; once this fires, the audio file can be
    // played
    await new Promise((resolve) => {
      this._notifySound.addEventListener(
        'canplaythrough',
        (event) => {
          resolve(event);
        },
      );
    });

    // pass the ready-to-play audio file to the constructor
    return new this(this._audioFileUrl, this._notifySound);
  }

  /**
   * Re-creates the audio file and waits for it to be ready for playback.
   * This allows replaying an audio file after it is garbage collected.
   *
   * @returns {Promise<Event>} A Promise that resolves with the `canplaythrough` event
   */
  async restart() {
    this._notifySound = new Audio(this._audioFileUrl);
    return new Promise((resolve) => {
      this._notifySound.addEventListener(
        'canplaythrough',
        (event) => {
          resolve(event);
        },
      );
    });
  }

  /**
   * Returns an async function that when invoked, plays the audio file, if it is ready to be played.
   */
  playAudio = async () => {
    try {
      await this._notifySound.play();
    } catch (err) {
      console.error('An error occured', err);
    }
  };

  /**
   * Returns if the audio file is ready for playback.
   * If the audio file has already completed playback, this will return false.
   *
   * @returns {boolean} true if the audio file is ready for playback, and false otherwise
   */
  get isReady() {
    return this._notifySound.readyState === HTMLAudioElement.HAVE_FUTURE_DATA
      || this._notifySound.readyState === HTMLAudioElement.HAVE_ENOUGH_DATA;
  }
}
