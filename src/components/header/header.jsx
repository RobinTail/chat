import React from "react";
import appData from "../../AppData.js";
import { setSounds } from "../../actions/chatActions";
import { version } from "../../../package.json";
import "./header.scss";

export default React.createClass({
  getInitialState: function () {
    return {
      sounds: appData.get("sounds"),
    };
  },

  render: function () {
    return (
      <div>
        <div className="appHeader">
          ⧓&nbsp;Robichat
          <span className="appVersion">{version}</span>
        </div>
        <div className="appSettingsBar">
          {this.renderSoundsOption()}
          <div className="signOutBtn" onClick={this._handleSignOut}></div>
        </div>
      </div>
    );
  },

  renderSoundsOption: function () {
    return (
      <div
        className={"soundBtn" + (this.state.sounds ? " _on" : "")}
        onClick={this._handleSounds}
      ></div>
    );
  },

  _handleSounds: function () {
    appData.set("sounds", !appData.get("sounds"));
    this.setState({
      sounds: appData.get("sounds"),
    });
    setSounds(appData.get("sounds"));
  },

  _handleSignOut: function () {
    window.location = "/logout";
  },
});
