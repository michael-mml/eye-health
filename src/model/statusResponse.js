export default class StatusResponse {
  soundIntervalId;

  notifyDurationInMinutes;

  constructor(soundIntervalId, notifyDurationInMinutes) {
    this.soundIntervalId = soundIntervalId;
    this.notifyDurationInMinutes = notifyDurationInMinutes;
  }
}
