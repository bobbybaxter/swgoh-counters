import React from 'react';
import MetaTags from 'react-meta-tags';

export default function ({ title, content }) {
  return (
    <MetaTags>
      <title>{title}</title>
      <meta name="description" content={content}/>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </MetaTags>
  );
}
