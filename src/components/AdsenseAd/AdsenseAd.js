import React from 'react';

import './AdsenseAd.scss';
// import PropTypes from 'prop-types';

const initAd = () => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

class AdsenseAd extends React.Component {
  componentDidMount() {
    initAd();
  }

  shouldComponentUpdate(nextProps) {
    const { props: { path } } = this;
    return nextProps.path !== path;
  }

  componentDidUpdate() {
    initAd();
  }

  render() {
    const {
      adSlot,
    } = this.props;
    return (
      <div className="AdsenseAd">
        <div key={adSlot} className="adslot_1 py-1">
          <ins
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              'min-width': '400px',
              'max-width': '970px',
              width: '100%',
              height: '90px',
            }}
            data-ad-client="ca-pub-9103583527998968"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }
}

// AdsenseAd.propTypes = {
//   path: PropTypes.string.isRequired,
//   className: PropTypes.string,
// };

// AdsenseAd.defaultProps = {
//   className: '',
// };

export default AdsenseAd;
