import React from 'react';
import MetaTags from 'react-meta-tags';

import './NotFound.scss';

export default function NotFound(props) {
  return (
    <div className="NotFound">
      <MetaTags>
        <title>Page Not Found</title>
        <meta name="description" content="This is not the page you're looking for."/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
        <h1 className="title">404 Error</h1>
        <p>Page not found</p>
    </div>
  );
}
