import store from './chat';
import moment from 'moment';
import {find as linkifyFind} from 'linkifyjs';
import linkifyString from 'linkifyjs/string';
import embdelyApi from '../api/embedly';
import appData from '../appData';

const DATE_MESSAGE_KEY_FORMAT = 'YYYY-MM-DD';
// jscs:disable maximumLineLength
const DATE_MESSAGE_TEXTS = [
    'What a lovely day!',
    'My life is my message, — Mahatma Gandhi',
    'Where there is love there is life, — Mahatma Gandhi',
    'An ounce of practice is worth more than tons of preaching, — Mahatma Gandhi',
    'The good man is the friend of all living things, — Mahatma Gandhi',
    'Truth never damages a cause that is just, — Mahatma Gandhi',
    'Self-respect knows no considerations, — Mahatma Gandhi',
    'Nobody can hurt me without my permission, — Mahatma Gandhi',
    'Peace is its own reward, — Mahatma Gandhi',
    'Even if you are a minority of one, the truth is the truth, — Mahatma Gandhi',
    'The time is always right to do what is right, — Martin Luther King, Jr.',
    'Injustice anywhere is a threat to justice everywhere, — Martin Luther King, Jr.',
    'A riot is the language of the unheard, — Martin Luther King, Jr.',
    'Seeing is not always believing, — Martin Luther King, Jr.',
    'Means we use must be as pure as the ends we seek, — Martin Luther King, Jr.',
    'A right delayed is a right denied, — Martin Luther King, Jr.',
    'The moral arc of the universe bends at the elbow of justice, — Martin Luther King, Jr.',
    'War is a poor chisel to carve out tomorrow, — Martin Luther King, Jr.',
    'We are not makers of history. We are made by history, — Martin Luther King, Jr.'
];
// jscs:enable maximumLineLength

export default function() {
    let messages = store.messages;

    // add date messages
    let dateMessagesPlan = [];
    let lastDate = null;
    if (messages.length) {
        messages.forEach((message, i) => {
            if (message.at && !message.isSystem) {
                let d = moment(message.at);
                let dKey = d.format(DATE_MESSAGE_KEY_FORMAT);
                if (dKey !== lastDate) {
                    if (store.dateMessagesPosted.indexOf(dKey) === -1) {
                        dateMessagesPlan.push({
                            key: dKey,
                            date: d,
                            index: i
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
            index: 0
        });
    }
    let offset = 0;
    dateMessagesPlan.forEach((plan, i) => {
        let randomText = DATE_MESSAGE_TEXTS[store.dateMessagesPosted.length ?
            (Math.floor(Math.random() * DATE_MESSAGE_TEXTS.length) + 1) : 0
        ];
        messages.splice(plan.index + offset, 0, {
            name: 'System',
            isSystem: true,
            text: plan.date.format('MMMM Do') + '. ' + randomText
        });
        offset++;
        store.dateMessagesPosted.push(plan.key);
    });

    // add isMy shorthand property
    messages.forEach(message => {
        message.isMy = message.userID === appData.get('userID');
    });

    // combine messages from same author
    let lastUserID = '';
    messages.forEach(message => {
        if (lastUserID === message.userID && !message.isSystem) {
            message.isSameAuthor = true;
        }
        lastUserID = message.userID;
    });

    // convert urls to anchors
    let parser = new Promise((resolve, reject) => {
        messages.filter(message => {
            return !message.isParsed && !message.isSystem;
        }).forEach(message => {
            message.isParsed = true;
            message.html = linkifyString(message.text, {
                format: (value, type) => {
                    if (type === 'url' && value.length > 50) {
                        value = value.slice(0, 50) + '…';
                    }
                    return value;
                }
            });
        });
        resolve();
    });
    parser.then(() => {
        store.triggerChange('messages');
    });

    // convert urls to embeds
    messages.filter(message => {
        return !message.isEmbed && !message.isSystem;
    }).forEach(message => {
        let urls = linkifyFind(message.text).filter(entry => {
            return entry.type === 'url';
        }).map(entry => {
            return entry.href;
        });
        if (urls.length) {
            let embed = embdelyApi.get(urls);
            embed.then(data => {
                if (data.type !== 'error') {
                    message.isEmbed = true;
                    message.embed = data;
                    store.triggerChange('messages');
                }
            });
        }
    });
}
