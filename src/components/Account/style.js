import styled from 'styled-components/macro';

export const AdminControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  justify-content: center;
  font-size: .8rem;
  margin-bottom: 1rem;
`;

export const AccountHeaderCenter = styled.div`
  justify-content: center;
  align-items: center;
  text-align: left;
  }
`;

export const AccountHeaderLeft = styled.div`
  text-align: left;
  padding: 0;
  td {
    padding: 0 1rem 0 0;
  }
`;

export const AccountHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  align-items: flex-end;
  table {
    margin: 0;
    text-align: right;
    padding-bottom: 1rem;
    font-size: 14px;
  }
  td {
    padding: 0 0 0 1rem;
  }
`;

export const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
`;

export const AccountHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
`;

export const ControlsDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  padding: 1rem;
  background: #181818;
  width: 50%;
`;
