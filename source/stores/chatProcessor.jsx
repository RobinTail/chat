import ChatStore from './chat';
import moment from 'moment';
import {find as linkifyFind} from 'linkifyjs';
import linkifyString from 'linkifyjs/string';
import embdelyApi from '../api/embedly';
import appData from '../appData';

export function preprocess() {
    let messages = ChatStore.messages;

    // add first date message when loaded
    if (!ChatStore.isDateMessagePosted) {
        let d = moment();
        if (messages.length) {
            let msg = messages[0];
            if (msg.at) {
                d = moment(msg.at);
            }
        }
        messages.unshift({
            name: 'System',
            isSystem: true,
            text: d.format('MMMM Do') + '. What a lovely day!'
        });
        ChatStore.isDateMessagePosted = true;
    }

    // add isMy shorthand property
    messages.forEach((message) => {
        message.isMy = message.userID === appData.get('userID');
    });

    // todo: add date message on new day start

    // combine messages from same author
    let lastUserID = '';
    messages.forEach((message) => {
        if (lastUserID === message.userID && !message.isSystem) {
            message.isSameAuthor = true;
        }
        lastUserID = message.userID;
    });

    // convert urls to anchors
    messages.filter((message) => {
        return !message.isParsed && !message.isSystem;
    }).forEach((message) => {
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
}

/**
 * Convert urls to embeds
 */
export function embedly() {
    let messages = ChatStore.messages;
    messages.filter((message) => {
        return !message.isEmbed && !message.isSystem;
    }).forEach((message) => {
        let urls = linkifyFind(message.text).filter((entry) => {
            return entry.type === 'url';
        }).map((entry) => {
            return entry.href;
        });
        if (urls.length) {
            let embed = embdelyApi.get(urls);
            embed.then((data) => {
                if (data.type !== 'error') {
                    message.isEmbed = true;
                    message.embed = data;
                    ChatStore.triggerChange('messages');
                }
            });
        }
    });
}
