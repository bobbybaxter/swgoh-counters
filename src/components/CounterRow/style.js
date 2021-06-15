import styled from 'styled-components/macro';
import { CounterRow } from 'src/styles/style';

export const CounterRowWrapper = styled.div`
  width: 100%;
`;

export const Divider = styled.div`
  margin-right: 20px;
  padding-right: 20px;
  border-right: 1px solid #343a40;

  @media only screen and (min-width:768px) {
    margin-right: 25px;
    padding-right: 25px;
  }

  @media only screen and (min-width:992px) {
    margin-right: 29px;
    padding-right: 29px;
  }

  @media only screen and (min-width:1200px) {
    margin-right: 35px;
    padding-right: 35px;
  }
`;

export const LeftDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  justify-content: center;
  border-bottom: 1px solid #343a40;
`;

export const RightDiv = styled(CounterRow)`
  border-left: 1px solid #343a40;
  border-bottom: 1px solid #343a40;
`;

export const RightDivWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;
