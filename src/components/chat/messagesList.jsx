import React from "react";
import Message from "./message";
import Embed from "./embed";
import appData from "../../AppData.js";
import "./messagesList.scss";

export default React.createClass({
  render: function () {
    return <ul className="messages-list">{this.renderMessages()}</ul>;
  },

  renderMessages: function () {
    if (this.props.messages.length) {
      return this.props.messages.map((message, id) => {
        return [
          <Message key={"message_" + id} data={message} />,
          <Embed
            key={"embed_" + id}
            isMy={message.isMy}
            data={message.embed}
          />,
        ];
      });
    } else {
      return (
        <Message
          key="nomessages"
          data={{
            isSystem: true,
            text:
              "Welcome, " + appData.get("name") + ". Type your first message.",
            author: {
              name: "System",
            },
          }}
        />
      );
    }
  },
});
