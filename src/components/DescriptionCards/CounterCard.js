/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, UncontrolledCollapse } from 'reactstrap';
import _ from 'lodash';
import { colors } from 'src/styles/colors';

import ModalEditCounter from 'src/components/Modals/ModalEditCounter';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import { useToggle } from 'src/helpers';
import { ContainerColumn, EditMenu } from 'src/styles/style';
import SquadHeader from 'src/components/shared/SquadHeader';

import {
  BottomWrapper,
  DescriptionButtonsWrapper,
  DescriptionButton,
  DescriptionText,
  DetailsDivLeft,
  DetailsDivRight,
  TopWrapper,
  VideoListItemWrapper,
} from './style';

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
  generalStrategy: '',
  latestVersionId: '',
  createdOn: '',
  createdById: '',
  createdByName: '',
};

const CounterCard = ({
  authenticated,
  counter,
  counterStubs,
  reload,
  size,
  user,
  view,
}) => {
  CounterCard.propTypes = {
    authenticated: PropTypes.bool,
    counter: PropTypes.object,
    counterStubs: PropTypes.object.isRequired,
    reload: PropTypes.func,
    size: PropTypes.string,
    user: PropTypes.object,
    view: PropTypes.string,
  };

  const [leftSquad, setLeftSquad] = useState(defaultSquad);
  const [rightSquad, setRightSquad] = useState(defaultSquad);
  const [zetaData, setZetaData] = useState();
  const [isOpen, setIsOpen] = useToggle(false);

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

  const buildOpponentDetails = (squad) => {
    if (squad) {
      const { description, generalStrategy } = squad;
      return (
        <>
          <DescriptionButtonsWrapper>
            {description && <DescriptionButton id={`opponentDetails_${id}`} size="sm">Opponent Details</DescriptionButton>}
            {generalStrategy && <DescriptionButton id={`generalStrategy_${id}`} size="sm">General Counter Strategy</DescriptionButton>}
          </DescriptionButtonsWrapper>
          {
            description && <UncontrolledCollapse toggler={`#opponentDetails_${id}`}>
              <DescriptionText className="text-left"><strong className="text-secondary">Details: </strong>{description}</DescriptionText>
            </UncontrolledCollapse>
          }
          {
            generalStrategy && <UncontrolledCollapse toggler={`#generalStrategy_${id}`}>
              <DescriptionText className="text-left"><strong className="text-secondary">General Strategy: </strong>{generalStrategy}</DescriptionText>
            </UncontrolledCollapse>
          }
        </>
      );
    }
    return '';
  };

  const buildCounterDetails = () => {
    const shouldPrintZeta = zetaData && zetaData.some(x => x.length > 0);
    const shouldPrintVideoLinks = !_.isEmpty(counter.videoLinks);

    return (
      <>
        <DescriptionButtonsWrapper>
          {shouldPrintZeta && <DescriptionButton id={`zetaReqs_${id}`} size="sm">Required Zetas</DescriptionButton>}
          {shouldPrintVideoLinks && <DescriptionButton id={`videoLinks_${id}`} size="sm">Videos</DescriptionButton>}
        </DescriptionButtonsWrapper>
        {
          shouldPrintZeta && <UncontrolledCollapse toggler={`#zetaReqs_${id}`} className="p-1">
            {zetaData.map((zeta, i) => (zeta.length > 0
              ? (
                <DescriptionText key={`${zeta}${i}`} className="text-left m-0 p-0"><strong className="text-secondary">{view === 'normal' ? rightSquad[`toon${i + 1}Name`] : leftSquad[`toon${i + 1}Name`]}: </strong> {zeta.join(', ')}</DescriptionText>
              )
              : ''))}
          </UncontrolledCollapse>
        }
        {
          shouldPrintVideoLinks && <UncontrolledCollapse toggler={`#videoLinks_${id}`} className="p`">
            <ContainerColumn>
              {counter.videoLinks.map((videoLink) => {
                const handleButton = () => window.open(videoLink.link);
                return (
                <VideoListItemWrapper key={videoLink.id}>
                  <DescriptionButton size="sm" color="warning" onClick={handleButton}>
                    {videoLink.title}
                  </DescriptionButton>
                  <EditMenu>
                    <p><small>updated on: {format(new Date(videoLink.createdOn), 'MMM d, yyyy')}</small></p>
                    <p><small>by: {videoLink.createdByName}</small></p>
                  </EditMenu>
                </VideoListItemWrapper>
                );
              })}
            </ContainerColumn>
          </UncontrolledCollapse>
        }
      </>
    );
  };

  const divColor = counter.isHardCounter === 1 ? colors.hardCounter : colors.softCounter;

  return (
    <>
    <TopWrapper>
      <DetailsDivLeft color={view === 'normal' ? '' : divColor}>
        <h6 className="text-secondary mb-1">{view === 'normal' ? 'Opponent Squad' : 'Counter Squad'}</h6>
        {view === 'normal'
          ? leftSquad && <SquadHeader size={size} squad={leftSquad} />
          : leftSquad && <SquadHeader counter={counter} showLocks={true} size={size} squad={leftSquad} />
        }
        { view === 'reverse' && buildCounterDetails() }
      </DetailsDivLeft>

      <DetailsDivRight color={view === 'normal' ? divColor : ''}>
        <h6 className="text-secondary mb-1">{view === 'normal' ? 'Counter Squad' : 'Opponent Squad'}</h6>
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
      {
        (counter.counterStrategy
          ? (<DescriptionText className="text-left"><strong className="text-secondary ">Counter Strategy: </strong>{counter.counterStrategy}</DescriptionText>)
          : (<DescriptionText className="text-left"><strong className="text-secondary ">Counter Strategy: </strong></DescriptionText>))
      }
      <EditMenu>
        {/* only users that have signed in, are active patrons, and have a allyCode can update counters */}
        {authenticated && user.patronStatus === 'active_patron' && user.username && <p><Button className="p-0 m-0" size="sm" color="link" onClick={() => setIsOpen(true)}><small>edit counter</small></Button></p>}
        {/* TODO: make the date a link that goes to a History page for the counter */}
        <p><small>updated on: {format(new Date(counter.createdOn), 'MMM d, yyyy')}</small></p>
        {/* TODO: make the username a link that goes to a page for the user */}
        <p><small>by: {counter.createdByName}</small></p>
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
          user={user}
          view={view}
        />
      </ModalPortal>
    )}
    </>
  );
};

export default React.memo(CounterCard);
