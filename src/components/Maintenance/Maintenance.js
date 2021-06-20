import React from 'react';
import MetaTags from 'react-meta-tags';
import styled from 'styled-components';

export const StyledMaintenance = styled.div`
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  // text-align: center;
  // padding: 3rem;
`;

export default function Maintenance( props ) {
  return (
    <StyledMaintenance>
      <MetaTags>
        <title>Maintenance</title>
        <meta name="description" content="Maintenance"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
        <h1 className="title">Sorry, we're down for maintenance.</h1>
        <p>Don't worry, you're gonna love the changes when we're back!</p>
    </StyledMaintenance>
  );
}
