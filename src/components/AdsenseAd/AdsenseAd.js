import React from 'react';

import './AdsenseAd.scss';
import PropTypes from 'prop-types';

const initAd = () => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

class AdsenseAd extends React.Component {
  state = {
    isProduction: process.env.NODE_ENV === 'production',
  }

  componentDidMount() {
    this.state.isProduction && initAd();
  }

  shouldComponentUpdate(nextProps) {
    const { props: { path } } = this;
    return nextProps.path !== path;
  }

  componentDidUpdate() {
    this.state.isProduction && initAd();
  }

  productionAd = (
    <div className="AdsenseAd">
      <div key={this.props.adSlot} className="adslot_1 py-1">
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            minWidth: '400px',
            maxWidth: '970px',
            width: '100%',
            height: '90px',
          }}
          data-ad-client="ca-pub-9103583527998968"
          data-ad-slot={this.props.adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );

  developmentAd = (
    <div>
      <div key={this.props.adSlot} className="py-1">
        <span
          className="adsbysaia"
          title={this.props.adSlot}
          style={{
            display: 'inline-block',
            minWidth: '400px',
            maxWidth: '970px',
            width: '100%',
            height: '280px',
            border: '.5rem blue solid',
          }}
        >
          {this.props.adSlot}
        </span>
      </div>
    </div>
  );

  render() {
    return (
      <>
        {this.state.isProduction ? this.productionAd : this.developmentAd}
      </>
    );
  }
}

AdsenseAd.propTypes = {
  adSlot: PropTypes.string.isRequired,
};

export default AdsenseAd;
