// Copyright 2013 Google Inc. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * A class to play a series of sample buffers at a constant rate.
 * @constructor
 */
function Player() {
  var OUT_RATE = 48000;
  var TIME_BUFFER = 0.05;

  var lastPlayedAt = -1;
  var frameno = 0;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  var ac = new (window.AudioContext || window.webkitAudioContext)();
  var gainNode = ac.createGainNode();
  gainNode.connect(ac.destination);

  /**
   * Queues the given samples for playing at the appropriate time.
   * @param {Float32Array} leftSamples The samples for the left speaker.
   * @param {Float32Array} rightSamples The samples for the right speaker.
   * @param {number} rate The sample rate.
   */
  function play(leftSamples, rightSamples, rate) {
    var buffer = ac.createBuffer(2, leftSamples.length, rate);
    buffer.getChannelData(0).set(leftSamples);
    buffer.getChannelData(1).set(rightSamples);
    var source = ac.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    lastPlayedAt = Math.max(
        lastPlayedAt + leftSamples.length / rate,
        ac.currentTime + TIME_BUFFER);
    source.start(lastPlayedAt);
  }

  /**
   * Sets the volume for playing samples.
   * @param {number} volume The volume to set, between 0 and 1.
   */
  function setVolume(volume) {
    gainNode.gain.value = volume;
  }

  return {
    play: play,
    setVolume: setVolume
  };
}

