import styled from 'styled-components/macro';

export const UnstyledButton = styled.button`
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
  outline: none;

  &:active {
    transform: translateY(1px);
    filter: saturate(150%);
  }

  &::-moz-focus-inner {
    border: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.5),
      0 0 0 1.5px rgba(255, 105, 180, 0.5);
  }

  /* hide focus style if not from keyboard navigation */
  .js-focus-visible .btn:focus:not(.focus-visible) {
    box-shadow: none;
  }
`;

export const UnstyledATag = styled.a`
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;

  &:active {
    transform: translateY(1px);
    filter: saturate(150%);
  }

  &::-moz-focus-inner {
    border: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.5),
      0 0 0 1.5px rgba(255, 105, 180, 0.5);
  }

  /* hide focus style if not from keyboard navigation */
  .js-focus-visible .btn:focus:not(.focus-visible) {
    box-shadow: none;
  }
`;

export const ContainerColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const StyledCounterRow = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  box-shadow: inset 4px 4px 15px rgba(255, 255, 255, 0.1), inset -4px -4px 15px rgba(255, 255, 255, 0.1);
`;

export const CounterCard = styled(StyledCounterRow)`
  box-shadow: none;
`;

export const CounterCardWrapper = styled.div`
  font-size: .85rem;
  p {
    margin: 8px 0;
  }

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

export const EditMenu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  p, a {
    padding: 0 .25rem;
    margin: 0 !important;
  }
`;

export const LeftDivSquad = styled(StyledCounterRow)`
  justify-content: center;
  padding: .5rem;
  border-right: 1px solid #343a40;
  border-bottom: 1px solid #343a40;
`;

export const NewSquadChar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  word-break: break-word;
`;

export const SquadTitle = styled.h6`
  font-size: .8rem;
  font-weight: 400;
  margin: 0;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
    font-weight: 400;
  }

  @media only screen and (min-width:992px) {
    font-size: 1rem;
    font-weight: 500;
  }

  @media only screen and (min-width:1200px) {
    font-size: 1.2rem;
    font-weight: 500;
  }
`;
