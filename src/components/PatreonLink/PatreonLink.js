import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components';

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

const AccountButton = styled(Button)`
  font-size: .7rem;
  height: 50%;
  font-size: .7rem;
  text-align: center;
  padding: .25rem;

  @media only screen and (min-width:600px) {
   font-size: .75rem;
  }

  @media only screen and (min-width:768px) {
    font-size: 1rem;
  }
`;

const PatreonLinkPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  text-align: center;
`;

export default function PatreonLink() {
  return (
    <PatreonLinkPage>
      <p>Please re-link your Patreon account to continue.</p>

      <AccountButton className="btn-sm" href={patreonLink}>
        Link Patreon
      </AccountButton>
    </PatreonLinkPage>
  );
}
