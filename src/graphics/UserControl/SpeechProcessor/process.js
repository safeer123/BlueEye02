// import test commands
import { LockBlueEye } from "./sampleConfig";
import { EventName } from "../../constants";
import EventEmitter from "../../../graphics/lib/EventEmitter";

class Node {
  commands = null; // commands
  children = {};
}

class ProcessSpeech {
  constructor() {
    this.rootNode = new Node();

    // Test commandSets
    this.registerCommands(LockBlueEye, () => true);

    EventEmitter.on(EventName.RegisterControls, this.registerControl);
    EventEmitter.on(EventName.ClearControls, this.clearControls);
  }

  registerControl = controlObj => {
    const { controls } = controlObj;
    const enableCheck = () => controlObj && controlObj.enabled;
    if (controls) {
      controls.forEach(c => {
        if (c.voice) {
          this.registerCommands(c.voice, enableCheck);
        }
      });
    }
  };

  clearControls = () => {
    this.clearCommands();
  };

  registerCommands(commandList = [], enableCheck) {
    commandList.forEach(c => {
      this.insertCommandSet({ ...c, enableCheck }, [...c.keys]);
    });
  }

  clearCommands() {
    this.rootNode = new Node();
  }

  insertCommandSet = (commandObj, keys, node) => {
    const currentNode = node || this.rootNode;
    if (keys.length > 0) {
      const key = keys.shift();
      currentNode.children[key] = currentNode.children[key] || new Node();
      this.insertCommandSet(commandObj, keys, currentNode.children[key]);
    } else {
      node.commands = node.commands || [];
      node.commands.push(commandObj);
    }
  };

  search(input) {
    let result = null;
    if (input && input.length > 0) {
      const wordList = input
        .trim()
        .split(" ")
        .map(w => w.toLowerCase());
      const hotKeys = wordList.filter(w => this.rootNode.children[w]);
      if (hotKeys.length > 0) {
        const wordLookup = {};
        wordList.forEach((w, index) => {
          wordLookup[w] = { index };
        });
        wordLookup.wordList = wordList;
        hotKeys.some(k => {
          result = this.findMatch(wordLookup, this.rootNode.children[k]);
          return result;
        });
      }
    }
    return result;
  }

  findMatch = (wordLookup, node) => {
    let result = null;
    if (node && wordLookup) {
      // Check if we found the match
      const matchResult = this.matchValue(wordLookup, node);
      if (matchResult) return matchResult;
      const hotKeys = Object.keys(node.children).filter(k => wordLookup[k]);
      if (hotKeys.length > 0) {
        hotKeys.some(k => {
          result = this.findMatch(wordLookup, node.children[k]);
          return result;
        });
      }
    }
    return result;
  };

  matchValue = (wordLookup, node) => {
    let result = null;
    const { commands } = node;
    if (commands && commands.length > 0) {
      commands.some(data => {
        const { match, enableCheck } = data;
        if (!enableCheck()) return false;
        if (match && match.length > 0) {
          const params = {};

          // If number of words are not same we reject first
          console.log(wordLookup.wordList.length, match.length);
          if (wordLookup.wordList.length !== match.length) {
            return false;
          }

          // Now check words and conditionals in the match array
          const matchFound = match.every((w, i) => {
            if (typeof w === "function") {
              return w(wordLookup.wordList[i], params);
            }
            if (typeof w === "string") {
              const word = w.toLowerCase();
              return wordLookup[word] /* && wordLookup[word].index === i */;
            }
            return false;
          });

          if (matchFound) {
            result = { data, params };
            return true;
          }
        }
        return false;
      });
    }
    return result;
  };
}

export default new ProcessSpeech();
