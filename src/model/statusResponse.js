export default class StatusResponse {
  /**
   *
   * @param {number} soundIntervalId the id returned by setInterval
   * @param {number} notifyDurationInMinutes the length of time to wait between successive playbacks
   */
  constructor(soundIntervalId, notifyDurationInMinutes) {
    this.soundIntervalId = soundIntervalId;
    this.notifyDurationInMinutes = notifyDurationInMinutes;
  }
}
