import appData from "../AppData.js";
import dispatcher from "../dispatcher/dispatcher";
import { actionTypes } from "../constants/constants";
import EventEmitter from "events";
import moment from "moment";

const DATE_MESSAGE_KEY_FORMAT = "YYYY-MM-DD";
const DATE_MESSAGE_TEXTS = [
  "What a lovely day!",
  "My life is my message, — Mahatma Gandhi",
  "Where there is love there is life, — Mahatma Gandhi",
  "An ounce of practice is worth more than tons of preaching, — Mahatma Gandhi",
  "The good man is the friend of all living things, — Mahatma Gandhi",
  "Truth never damages a cause that is just, — Mahatma Gandhi",
  "Self-respect knows no considerations, — Mahatma Gandhi",
  "Nobody can hurt me without my permission, — Mahatma Gandhi",
  "Peace is its own reward, — Mahatma Gandhi",
  "Even if you are a minority of one, the truth is the truth, — Mahatma Gandhi",
  "The time is always right to do what is right, — Martin Luther King, Jr.",
  "Injustice anywhere is a threat to justice everywhere, — Martin Luther King, Jr.",
  "A riot is the language of the unheard, — Martin Luther King, Jr.",
  "Seeing is not always believing, — Martin Luther King, Jr.",
  "Means we use must be as pure as the ends we seek, — Martin Luther King, Jr.",
  "A right delayed is a right denied, — Martin Luther King, Jr.",
  "The moral arc of the universe bends at the elbow of justice, — Martin Luther King, Jr.",
  "War is a poor chisel to carve out tomorrow, — Martin Luther King, Jr.",
  "We are not makers of history. We are made by history, — Martin Luther King, Jr.",
];
const CHANGE_EVENT = "change";

export default new (class ChatStore extends EventEmitter {
  constructor() {
    super();
    this._messages = [];
    this._typing = [];
    this._dateMessagesAdded = [];
    this._dispatchToken = dispatcher.register((action) => {
      switch (action.type) {
        case actionTypes.NEW_MESSAGES:
          this._addDateMessages();
      }
    });
  }

  _addDateMessages() {
    let dateMessagesPlan = [];
    let lastDate = null;
    if (this._messages.length) {
      this._messages.forEach((message, i) => {
        if (message.at && !message.isSystem) {
          let d = moment(message.at);
          let dKey = d.format(DATE_MESSAGE_KEY_FORMAT);
          if (dKey !== lastDate) {
            if (this._dateMessagesAdded.indexOf(dKey) === -1) {
              dateMessagesPlan.push({
                key: dKey,
                date: d,
                index: i,
              });
            }
          }
          lastDate = dKey;
        }
      });
    } else {
      let d = moment();
      let dKey = d.format(DATE_MESSAGE_KEY_FORMAT);
      dateMessagesPlan.push({
        key: dKey,
        date: moment(),
        index: 0,
      });
    }
    let offset = 0;
    dateMessagesPlan.forEach((plan) => {
      let randomText =
        DATE_MESSAGE_TEXTS[
          this._dateMessagesAdded.length
            ? Math.floor(Math.random() * DATE_MESSAGE_TEXTS.length) + 1
            : 0
        ];
      this._messages.splice(plan.index + offset, 0, {
        author: {
          name: "System",
        },
        isSystem: true,
        text: plan.date.format("MMMM Do") + ". " + randomText,
        at: new Date(),
      });
      offset++;
      this._dateMessagesAdded.push(plan.key);
    });
  }
})();
