export default class StopResponse {
  /**
   *
   * @param {number} soundIntervalId the id returned by setInterval
   */
  constructor(soundIntervalId) {
    this.soundIntervalId = soundIntervalId;
  }
}
