import {
  expect,
  it,
  jest,
} from '@jest/globals';
import AudioOrchestrator from '../../../src/background_page/audio/audioOrchestrator.js';
import AudioPlayer from '../../../src/background_page/audio/audioPlayer.js';

const SECONDS_IN_MIN = 60;
const MILLISECONDS_IN_SECOND = 1000;
const DEFAULT_NOTIFY_DURATION_IN_MINS = 20;
const PATH_TO_AUDIO_FILE = '../../sounds/Ariel.ogg';

// TODO: research why 'modern' does not work
jest.useFakeTimers('legacy');

it('test audio orchestrator plays sound one time', async () => {
  // setup
  let mockAudio = new Audio(PATH_TO_AUDIO_FILE);
  mockAudio = {
    ...mockAudio,
    readyState: HTMLMediaElement.HAVE_ENOUGH_DATA,
    play: () => { },
  };
  const mockAudioPlayer = new AudioPlayer(PATH_TO_AUDIO_FILE, mockAudio);
  const audioOrchestrator = new AudioOrchestrator(mockAudioPlayer);

  // trigger
  const intervalId = await audioOrchestrator.playSoundEveryInterval();
  jest.advanceTimersByTime(DEFAULT_NOTIFY_DURATION_IN_MINS
    * SECONDS_IN_MIN
    * MILLISECONDS_IN_SECOND);

  // verify
  expect(setInterval).toBeCalled();
  expect(setInterval).toBeCalledWith(expect.any(Function), DEFAULT_NOTIFY_DURATION_IN_MINS
    * SECONDS_IN_MIN
    * MILLISECONDS_IN_SECOND);
  expect(intervalId).toBeGreaterThanOrEqual(0);
});

it('test audio orchestrator stops playing sound', async () => {
  // setup
  let mockAudio = new Audio(PATH_TO_AUDIO_FILE);
  mockAudio = {
    ...mockAudio,
    readyState: HTMLMediaElement.HAVE_ENOUGH_DATA,
    play: () => { },
  };
  const mockAudioPlayer = new AudioPlayer(PATH_TO_AUDIO_FILE, mockAudio);
  const audioOrchestrator = new AudioOrchestrator(mockAudioPlayer);

  await audioOrchestrator.playSoundEveryInterval();
  jest.advanceTimersByTime(DEFAULT_NOTIFY_DURATION_IN_MINS
    * SECONDS_IN_MIN
    * MILLISECONDS_IN_SECOND);

  // trigger
  await audioOrchestrator.stopSoundInterval();

  // verify
  expect(audioOrchestrator.intervalId).toBeNull();
});
