import React from "react";
import EventEmitter from "../../lib/EventEmitter";
import { EventName } from "../../constants";
import ProcessSpeech from "./process";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;

const grammar =
  "#JSGF V1.0; grammar colors; public <color> = blue | eye | lock | unlock | tower ;";

const CharCount = 15;

class SpeechProcessor {
  constructor() {
    // Enable flag
    this.enabled = false;

    if (SpeechRecognition && SpeechGrammarList) {
      this.recognition = new SpeechRecognition();

      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      this.recognition.grammars = speechRecognitionList;

      this.recognition.continuous = true;
      this.recognition.lang = "en-US";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      EventEmitter.on(EventName.ToggleSpeechDetection, this.startDetection);

      this.recognition.onresult = this.onResult;
      this.recognition.onnomatch = this.onNoMatch;
      this.recognition.onerror = this.onError;
      this.recognition.onspeechstart = this.onSpeechStart;
      this.recognition.onspeechend = this.onSpeechEnd;
      this.recognition.onend = this.onEnd;
    }
  }

  onSpeechStart = () => {
    EventEmitter.emit(EventName.SoundStart);
  };

  onSpeechEnd = () => {
    EventEmitter.emit(EventName.SoundEnd);
  };

  startDetection = flag => {
    if (flag) {
      this.recognition.start();
      this.enabled = true;
    } else {
      this.recognition.abort();
      this.enabled = false;
    }
  };

  onEnd = () => {
    if (this.enabled) {
      // this.displayOut(["Restarting..."]);
      this.startDetection(true);
    } else {
      this.displayOut(["Speech detection turned off"]);
    }
  };

  displayOut = (displayOutList, duration = 2) => {
    EventEmitter.emit(EventName.DisplayOutRequest, {
      displayOutList,
      duration
    });
  };

  onResult = event => {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The [last] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object

    const last = event.results.length - 1;
    const [{ transcript, confidence }] = event.results[last];
    const confidencePercent = Number.parseInt(confidence * 100, 10);
    // console.log(event.results);
    const displayTimeout = 2 + 2 * parseInt(transcript.length / CharCount, 10);
    this.displayOut([transcript], displayTimeout);
    EventEmitter.emit(EventName.HighlightMessage, "speech");

    // Search for matching command
    const result = ProcessSpeech.search(transcript);
    if (result) {
      EventEmitter.emit(EventName.HighlightMessage, "success");
      if (result.data && result.data.action && result.params) {
        result.data.action(result.params);
      }
    }
    // console.log(result);
  };

  onNoMatch = event => {
    // this.displayOut(["No match for the voice..."]);
  };

  onError = event => {
    const error = `Error occurred in recognition: ${event.error}`;
    this.displayOut([error]);
  };
}

export default new SpeechProcessor();
