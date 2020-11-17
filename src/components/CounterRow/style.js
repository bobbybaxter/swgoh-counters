import styled from 'styled-components';
import { CounterRow } from 'src/styles/style';

export const CounterRowWrapper = styled.div`
  width: 100%;
`;

export const DescriptionCardWrapper = styled.div`
  font-size: .85rem;
  p {
    margin: 8px 0;
  }
  margin-top: .5rem;
  margin-bottom: .5rem;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:992px) {
    font-size: .95rem;
  }

  @media only screen and (min-width:1200px) {
    font-size: 1rem;
  }
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

export const LeftDiv = styled(CounterRow)`
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

export const SquadTitle = styled.h6`
  font-size: .8rem;
  font-weight: 400;
  margin: 0;
`;
