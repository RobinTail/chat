import React from 'react';
import './embed.scss';

export default React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.data !== this.props.data;
    },

    render: function() {
        if (this.props.data) {
            let embedContains = this.props.data.map(function(obj, i) {
                //console.log(obj);

                let embedTitle = (
                    <div><strong>
                        <a href={obj.url}>{obj.title}</a>
                    </strong></div>
                );

                let embedDesc = (
                    <div>{obj.description}</div>
                );

                let embedInfo = (
                    <div className='embed-info'>
                                {embedTitle}
                                {embedDesc}
                    </div>
                );

                let embedImage = null;
                switch (obj.type) {
                    case 'video':
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        let vthUrl = obj.thumbnail_url;
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        embedImage = (
                            <div className='embed-video'
                                style={{
                                    backgroundImage: 'url(' + vthUrl + ')'
                                }}
                                dangerouslySetInnerHTML={{__html: obj.html}}
                            ></div>
                        );
                        embedInfo = null;
                        break;
                    case 'photo':
                        let phPortrait = obj.width < obj.height ? ' portrait' : '';
                        embedImage = (
                            <div className='embed-thumb'>
                                <a href={obj.url}>
                                    <img
                                    className={'embed-photo' + phPortrait}
                                    src={obj.url}
                                    />
                                </a>
                            </div>
                        );
                        embedInfo = null;
                        break;
                    default:
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        let thPortrait = obj.thumbnail_width < obj.thumbnail_height ?
                            ' portrait' : '';
                        let thUrl = obj.thumbnail_url;
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        embedImage = thUrl ? (
                            <div className='embed-thumb small'>
                                <img
                                    className={'embed-photo' + thPortrait}
                                    src={thUrl}
                                />
                            </div>
                        ) : null;
                }

                return (
                    <div className='embed-item' key={i}>
                        {embedImage}
                        {embedInfo}
                    </div>
                );
            });

            let embedClass = 'embed-wrapper' + (
                    this.props.isMy ? ' embed-my' : ''
            );
            return (
                <li className={embedClass}>
                    <div className='message-same-author-placeholder'></div>
                    {embedContains}
                </li>
            );
        } else {
            return null;
        }
    }
});
