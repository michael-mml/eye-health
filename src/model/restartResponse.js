export default class RestartResponse {
  soundIntervalId;

  notifyDurationInMinutes;

  constructor(soundIntervalId, notifyDurationInMinutes) {
    this.soundIntervalId = soundIntervalId;
    this.notifyDurationInMinutes = notifyDurationInMinutes;
  }
}
