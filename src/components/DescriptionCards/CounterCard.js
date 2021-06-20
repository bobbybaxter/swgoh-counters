/* eslint-disable max-len */
import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, UncontrolledCollapse } from 'reactstrap';
import _ from 'lodash';
import { colors } from 'src/styles/colors';

import ModalEditCounter from 'src/components/Modals/ModalEditCounter';
import ModalVariations from 'src/components/Modals/ModalVariations';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import { useToggle } from 'src/helpers';
import { AuthContext } from 'src/contexts/userContext';
import { deleteCounter } from 'src/helpers/data';
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

const CounterCard = ({
  counter,
  leftSquad,
  reload,
  size,
  view,
}) => {
  CounterCard.propTypes = {
    counter: PropTypes.object,
    leftSquad: PropTypes.object.isRequired,
    reload: PropTypes.func,
    size: PropTypes.string,
    view: PropTypes.string,
  };

  const {
    id, toon1Zetas, toon2Zetas, toon3Zetas, toon4Zetas, toon5Zetas,
  } = counter;

  const rightSquad = {
    id: counter.squadId,
    name: counter.name,
    description: counter.description,
    generalStrategy: counter.generalStrategy,
    toon1Id: counter.toon1Id,
    toon2Id: counter.toon2Id,
    toon3Id: counter.toon3Id,
    toon4Id: counter.toon4Id,
    toon5Id: counter.toon5Id,
    toon1Name: counter.toon1Name,
    toon2Name: counter.toon2Name,
    toon3Name: counter.toon3Name,
    toon4Name: counter.toon4Name,
    toon5Name: counter.toon5Name,
  };

  const [isOpen, setIsOpen] = useToggle(false);
  const [isVariationsModalOpen, setIsVariationsModalOpen] = useToggle(false);

  const {
    authenticated, isActivePatron, user,
  } = useContext(AuthContext);

  const zetaData = [toon1Zetas, toon2Zetas, toon3Zetas, toon4Zetas, toon5Zetas];

  const buildOpponentDetails = squad => {
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
          {shouldPrintZeta && <DescriptionButton outline id={`zetaReqs_${id}`} size="sm">Required Zetas</DescriptionButton>}
          {shouldPrintVideoLinks && <DescriptionButton outline id={`videoLinks_${id}`} size="sm">Videos</DescriptionButton>}
        </DescriptionButtonsWrapper>
        {
          shouldPrintZeta && <UncontrolledCollapse toggler={`#zetaReqs_${id}`} className="p-1">
            {zetaData.map((zeta, i) => (zeta.length > 0
              ? (
                <DescriptionText key={`${zeta}${i}`} className="text-left m-0 p-0"><strong className="text-secondary">{view === 'normal' ? counter[`toon${i + 1}Name`] : leftSquad[`toon${i + 1}Name`]}: </strong> {zeta.join(', ')}</DescriptionText>
              )
              : ''))}
          </UncontrolledCollapse>
        }
        {
          shouldPrintVideoLinks && <UncontrolledCollapse toggler={`#videoLinks_${id}`} className="p`">
            <ContainerColumn>
              {counter.videoLinks.map(videoLink => {
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

  async function handleDeleteCounter() {
    await deleteCounter(id);
    console.info(`counter for ${id} deleted`);
  }

  const divColor = counter.isHardCounter ? colors.hardCounter : colors.softCounter;

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
            ? <SquadHeader counter={counter} showLocks={true} size={size} squad={counter} />
            : <SquadHeader size={size} squad={counter} />
        }
        { view === 'normal' ? buildCounterDetails() : buildOpponentDetails(counter) }
      </DetailsDivRight>

    </TopWrapper>
    <div className="w-100">
      <Button outline className="w-100" size="sm" onClick={() => setIsVariationsModalOpen(true)}>See Variations</Button>
    </div>
    {isVariationsModalOpen && (
      <ModalPortal>
        <ModalVariations
          counter={counter}
          isOpen={isVariationsModalOpen}
          leftSquad={leftSquad}
          rightSquad={rightSquad}
          size={size}
          toggle={setIsVariationsModalOpen}
          view={view}
        />
      </ModalPortal>
    )}
    <BottomWrapper>
      {
        (counter.counterStrategy
          ? (<DescriptionText className="text-left"><strong className="text-secondary ">Counter Strategy: </strong>{counter.counterStrategy}</DescriptionText>)
          : (<DescriptionText className="text-left"><strong className="text-secondary ">Counter Strategy: </strong></DescriptionText>))
      }
      <EditMenu>
        {/* only users that have signed in, are active patrons, and have a allyCode can update counters */}
        {isActivePatron && user.username && <p><Button className="p-0 m-0" size="sm" color="link" onClick={() => setIsOpen(true)}><small>edit counter</small></Button></p>}
        <p><small>updated on: {format(new Date(counter.counterCreatedOn), 'MMM d, yyyy')}</small></p>
        <p><small>by: {counter.counterCreatedByName}</small></p>
        {authenticated && user.id === process.env.REACT_APP_ADMIN_ID && <p><Button className="p-0 m-0" size="sm" color="link" onClick={handleDeleteCounter}><small>delete counter</small></Button></p>}
      </EditMenu>
    </BottomWrapper>
    {isOpen && (
      <ModalPortal>
        <ModalEditCounter
          counter={counter}
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
};

export default CounterCard;
