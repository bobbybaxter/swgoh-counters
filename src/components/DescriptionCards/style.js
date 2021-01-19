import styled from 'styled-components/macro';
import { Button } from 'reactstrap';

export const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width:768px) {
    flex-direction: row;
  }
`;

export const BottomWrapper = styled.div`
  padding: .25rem;
  border-top: 1px solid #343a40;

  @media only screen and (min-width:768px) {
    padding: .5rem;
  }
`;

export const DescriptionButton = styled(Button)`
  margin: .25rem;
`;

export const DescriptionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const DescriptionText = styled.p`
  padding: .5rem;
  margin: 0 !important;
  white-space: pre-line;

  @media only screen and (min-width:768px) {
  }
`;

export const DetailsDivCenter = styled.div`
  width: 100%;
  padding: .5rem;
  margin: inherit;
`;

export const DetailsDivLeft = styled.div`
  padding: .5rem;

  @media only screen and (min-width:768px) {
    border-right: 1px solid #343a40;
    margin: inherit;
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

export const DetailsDivRight = styled.div`
  padding: .5rem;
  border-top: 1px solid #343a40;

  @media only screen and (min-width:768px) {
    border-top: none;
    flex: 0 0 50%;
    max-width: 50%;
    margin: inherit;
  }
`;

export const VideoListItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
