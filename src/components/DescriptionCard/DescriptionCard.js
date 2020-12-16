/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, UncontrolledCollapse } from 'reactstrap';

import ModalEditCounter from 'src/components/ModalEditCounter/ModalEditCounter';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import SquadHeader from 'src/components/shared/SquadHeader';
import { useToggle } from 'src/helpers';
import { DescriptionCardWrapper, EditMenu } from 'src/styles/style';

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width:768px) {
    flex-direction: row;
  }
`;

const BottomWrapper = styled.div`
  padding: .25rem;
  border-top: 1px solid #343a40;

  @media only screen and (min-width:768px) {
    padding: .5rem;
  }
`;

const DescriptionButton = styled(Button)`
  margin: .25rem;
`;

const DescriptionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DescriptionText = styled.p`
  padding: .5rem;
  margin: 0 !important;

  @media only screen and (min-width:768px) {
    padding: .5rem;
  }
`;

const DetailsDivLeft = styled.div`
  padding: .5rem;

  @media only screen and (min-width:768px) {
    border-right: 1px solid #343a40;
    padding: .5rem;
    margin: inherit;
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

const DetailsDivRight = styled.div`
  padding: .5rem;
  border-top: 1px solid #343a40;

  @media only screen and (min-width:768px) {
    border-top: none;
    flex: 0 0 50%;
    max-width: 50%;
    padding: .5rem;
    margin: inherit;
  }
`;

// TODO: add videos
// TODO: add createdOn and createdBy
// TODO: add CRUD functionality
// TODO: move styled components to a style.js file
const defaultSquad = {
  id: '',
  name: '',
  toon1Id: '',
  toon1Name: '',
  toon2Id: '',
  toon2Name: '',
  toon3Id: '',
  toon3Name: '',
  toon4Id: '',
  toon4Name: '',
  toon5Id: '',
  toon5Name: '',
  description: '',
  counterStrategy: '',
  latestVersionId: '',
  createdOn: '',
  createdBy: '',
};

export default function DescriptionCard({
  counter,
  counterStubs,
  reload,
  size,
  view,
}) {
  DescriptionCard.propTypes = {
    counter: PropTypes.object,
    counterStubs: PropTypes.object.isRequired,
    reload: PropTypes.func,
    size: PropTypes.string,
    view: PropTypes.string,
  };

  const [leftSquad, setLeftSquad] = useState(defaultSquad);
  const [rightSquad, setRightSquad] = useState(defaultSquad);
  const [zetaData, setZetaData] = useState();
  const [isOpen, setIsOpen] = useToggle(false);

  const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
  const discordLink = 'https://discord.gg/eCnE48h';

  const {
    counterSquadId,
    id,
    opponentSquadId,
    toon1Zetas,
    toon2Zetas,
    toon3Zetas,
    toon4Zetas,
    toon5Zetas,
  } = counter;

  useEffect(() => {
    async function getSquad() {
      const squads = JSON.parse(sessionStorage.getItem('squads')) || [];
      const matchedLeftSquad = squads.find(x => x.id === (view === 'normal' ? opponentSquadId : counterSquadId));
      const matchedRightSquad = squads.find(x => x.id === (view === 'normal' ? counterSquadId : opponentSquadId));
      await setLeftSquad(matchedLeftSquad);
      await setRightSquad(matchedRightSquad);
    }

    getSquad();
    setZetaData([
      toon1Zetas,
      toon2Zetas,
      toon3Zetas,
      toon4Zetas,
      toon5Zetas,
    ]);
  }, [counterSquadId,
    opponentSquadId,
    toon1Zetas,
    toon2Zetas,
    toon3Zetas,
    toon4Zetas,
    toon5Zetas,
    view]);

  const createCounterDescription = description => ({ __html: description });
  const createCounterStrategy = counterStrategy => ({ __html: counterStrategy });

  const buildOpponentDetails = (squad) => {
    if (squad) {
      const { description, counterStrategy } = squad;
      return (
        <>
          <DescriptionButtonsWrapper>
            {description && <DescriptionButton id={`opponentDetails_${id}`} size="sm">Opponent Details</DescriptionButton>}
            {counterStrategy && <DescriptionButton id={`generalCounterStrategy_${id}`} size="sm">General Counter Strategy</DescriptionButton>}
          </DescriptionButtonsWrapper>
          {
            description && <UncontrolledCollapse toggler={`#opponentDetails_${id}`}>
              <DescriptionText className="text-left"><strong className="text-secondary">Details: </strong>{description}</DescriptionText>
            </UncontrolledCollapse>
          }
          {
            counterStrategy && <UncontrolledCollapse toggler={`#generalCounterStrategy_${id}`}>
              <DescriptionText className="text-left"><strong className="text-secondary">General Strategy: </strong><span dangerouslySetInnerHTML={createCounterStrategy(counterStrategy)}></span></DescriptionText>
            </UncontrolledCollapse>
          }
        </>
      );
    }
    return '';
  };

  const buildCounterDetails = () => (
    <>
        {zetaData
        && zetaData.some(x => x.length > 0)
        && <>
            <DescriptionCardWrapper>
              <DescriptionButton id={`zetaReqs_${id}`} size="sm">Required Zetas</DescriptionButton>
            </DescriptionCardWrapper>
            <UncontrolledCollapse toggler={`#zetaReqs_${id}`} className="p-1">
              {zetaData.map((zeta, i) => (zeta.length > 0
                ? (
                  <DescriptionText key={`${zeta}${i}`} className="text-left m-0 p-0"><strong className="text-secondary">{view === 'normal' ? rightSquad[`toon${i + 1}Name`] : leftSquad[`toon${i + 1}Name`]}: </strong> {zeta.join(', ')}</DescriptionText>
                )
                : ''))}
            </UncontrolledCollapse>
        </>}
    </>
  );

  const buildCounterStrategy = (squad) => {
    const { name } = squad;
    const counterDescription = counter.description;
    return (
      <>
        {(counterDescription)
          ? (<DescriptionText className="text-left"><strong className="text-secondary ">Counter Strategy: </strong><span dangerouslySetInnerHTML={createCounterDescription(counterDescription)}></span></DescriptionText>)
          : (<DescriptionText className="text-secondary"><small>Do you know the specific strategy for {name}?  If so, please <a href={submissionForm}>submit an issue.</a></small></DescriptionText>)}
        {(counterDescription) ? '' : (<DescriptionText className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></DescriptionText>)}
      </>
    );
  };

  return (
    <>
    <TopWrapper>
      <DetailsDivLeft>
        <h6 className="text-secondary mb-1">{view === 'normal' ? 'Opponent Team' : 'Counter Team'}</h6>
        {view === 'normal'
          ? leftSquad && <SquadHeader size={size} squad={leftSquad} />
          : leftSquad && <SquadHeader counter={counter} showLocks={true} size={size} squad={leftSquad} />
        }
        { view === 'normal' ? buildOpponentDetails(leftSquad) : buildCounterDetails() }
      </DetailsDivLeft>

      <DetailsDivRight>
        <h6 className="text-secondary mb-1">{view === 'normal' ? 'Counter Team' : 'Opponent Team'}</h6>
        {
          view === 'normal'
            ? rightSquad && rightSquad.id
            && <SquadHeader counter={counter} showLocks={true} size={size} squad={rightSquad} />
            : rightSquad && rightSquad.id
            && <SquadHeader size={size} squad={rightSquad} />
        }
        { view === 'normal' ? buildCounterDetails() : buildOpponentDetails(rightSquad) }
      </DetailsDivRight>

    </TopWrapper>
    <BottomWrapper>
      {buildCounterStrategy(rightSquad)}
      <EditMenu>
        {/* TODO: only show edit button to Patrons */}
        {/* TODO: make edit button open a modal to change the counter info */}
        <p><a href="#" onClick={() => setIsOpen(true)}><small>edit counter</small></a></p>
        {/* TODO: make the date a link that goes to a History page for the counter */}
        <p><small>last updated on: {format(new Date(counter.createdOn), 'MMM d, yyyy')}</small></p>
        {/* TODO: make the username a link that goes to a page for the user */}
        <p><small>by: {counter.createdBy}</small></p>
      </EditMenu>
    </BottomWrapper>
    {isOpen && (
      <ModalPortal>
        <ModalEditCounter
          counter={counter}
          counterStubs={counterStubs}
          isOpen={isOpen}
          leftSquad={leftSquad}
          reload={reload}
          rightSquad={rightSquad}
          size={size}
          toggle={setIsOpen}
          view={view}
        />
      </ModalPortal>
    )}
    </>
  );
}
