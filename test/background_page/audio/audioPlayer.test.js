import {
  expect,
  it,
  jest,
} from '@jest/globals';
import AudioPlayer from '../../../src/background_page/audio/audioPlayer.js';

const PATH_TO_AUDIO_FILE = '../../sounds/Ariel.ogg';

// TODO: research why 'modern' does not work
jest.useFakeTimers('legacy');

it('test audio player plays sound', async () => {
  // setup
  let mockAudio = new Audio(PATH_TO_AUDIO_FILE);
  mockAudio = {
    ...mockAudio,
    readyState: HTMLMediaElement.HAVE_ENOUGH_DATA,
    // mock the play method because it only exists in the DOM
    play: jest.fn(() => Promise.resolve()),
  };
  const mockAudioPlayer = new AudioPlayer(PATH_TO_AUDIO_FILE, mockAudio);

  // trigger
  const res = await mockAudioPlayer.playAudio();

  // verify
  expect(mockAudio.play()).resolves.toBeUndefined();
  expect(res).toBeUndefined();
});

it('test audio player catches error', async () => {
  // setup
  let mockAudio = new Audio(PATH_TO_AUDIO_FILE);
  mockAudio = {
    ...mockAudio,
    readyState: HTMLMediaElement.HAVE_ENOUGH_DATA,
    // mock the play method because it only exists in the DOM
    play: jest.fn(() => Promise.reject(new Error())),
  };
  const mockAudioPlayer = new AudioPlayer(PATH_TO_AUDIO_FILE, mockAudio);

  // trigger
  await mockAudioPlayer.playAudio();

  // verify
  expect(mockAudio.play()).rejects.toEqual(new Error());
});
