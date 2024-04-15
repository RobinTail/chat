import Dispatcher from "../dispatcher/dispatcher";
import { actionTypes } from "../constants/constants";
import chatAPI from "../api/chat";

function emitNewMessages(messages) {
  Dispatcher.dispatch({
    type: actionTypes.NEW_MESSAGES,
    messages: messages,
  });
}

function emitTyping(data, isStart) {
  Dispatcher.dispatch({
    type: isStart
      ? actionTypes.THEY_START_TYPING
      : actionTypes.THEY_STOP_TYPING,
    data: data,
  });
}

function emitMessageAdditionalData(messageID, additionalData) {
  Dispatcher.dispatch({
    type: actionTypes.MESSAGE_ADDITIONAL_DATA,
    messageID: messageID,
    additionalData: additionalData,
  });
}

export function iStartTyping() {
  chatAPI.iStartTyping();
}

export function iStopTyping() {
  chatAPI.iStopTyping();
}

export function submitMessage(text) {
  chatAPI.submitMessage(text);
}

export function setSounds(isEnabled) {
  chatAPI.setSounds(isEnabled);
}

chatAPI.addTypingListener((data, isStart) => {
  emitTyping(data, isStart);
});
