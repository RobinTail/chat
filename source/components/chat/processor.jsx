import moment from 'moment';
import {find as linkifyFind} from 'linkifyjs';
import linkifyString from 'linkifyjs/string';
import embdelyApi from '../../api/embedly';
import appData from '../../appData';

export default function(chat, messages) {

    // add first date message when loaded
    if (!chat.state.isLoaded) {
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
    }

    // add isMy shorthand property
    messages.forEach(function(message) {
        message.isMy = message.userID === appData.get('userID');
    });

    // todo: add date message on new day start

    // combine messages from same author
    let lastUserID = '';
    messages.forEach(function(message) {
        if (lastUserID === message.userID && !message.isSystem) {
            message.isSameAuthor = true;
        }
        lastUserID = message.userID;
    });

    // convert urls to anchors and embeds
    let parser = new Promise(function(resolve, reject) {
        messages.filter(function(message) {
            return !message.isParsed;
        }).forEach(function(message) {
            message.isParsed = true;
            let urls = linkifyFind(message.text).filter(function(entry) {
                return entry.type === 'url';
            }).map(function(entry) {
                return entry.href;
            });
            if (urls.length) {
                let embed = embdelyApi.get(urls);
                embed.then(function(data) {
                    if (data.type !== 'error') {
                        message.embed = data;
                        chat.setState({
                            messages: chat.state.messages
                        });
                    }
                });
            }
            message.html = linkifyString(message.text);
        });
        resolve(messages);
    });
    parser.then(function(messages) {
        chat.setState({
            messages: messages
        });
    });

    return messages;
}
