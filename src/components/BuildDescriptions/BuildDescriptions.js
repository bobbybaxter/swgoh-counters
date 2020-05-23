import React from 'react';
import { Collapse } from 'reactstrap';

export default function BuildDescriptions(props) {
  const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
  const discordLink = 'https://discord.gg/eCnE48h';
  const {
    collapse, counterTeams, squadWithCharData, view,
  } = props;
  const {
    name,
    leaderName,
    leaderImage,
    toon2Name,
    toon2Image,
    toon3Name,
    toon3Image,
    toon4Name,
    toon4Image,
    toon5Name,
    toon5Image,
    subs,
    description,
    counterStrategy,
  } = squadWithCharData;
  const leftSideTitle = view === 'normal' ? 'Opponent Team' : 'Counter Team';
  const rightSideTitle = view === 'normal' ? 'Counter Team' : 'Opponent Team';

  const matchupDetails = counterTeams
    .map((counterTeam) => {
      const {
        oppTeamName,
        oppLeaderName,
        oppLeaderImage,
        oppToon2Name,
        oppToon2Image,
        oppToon3Name,
        oppToon3Image,
        oppToon4Name,
        oppToon4Image,
        oppToon5Name,
        oppToon5Image,
        oppSubs,
        oppCounterStrategy,
        oppDetails,
        description: counterDescription,
      } = counterTeam;

      const selectDescriptionData = (side) => {
        if (side === 'left') {
          if (view === 'normal') {
            return (
              <>
                {(description) ? (<p><strong className="text-secondary">Details: </strong>{description}</p>) : ''}
                {(counterStrategy)
                  ? (<p><strong className="text-secondary">General Strategy: </strong>{counterStrategy}</p>)
                  : (<p className="text-secondary"><small>You can help me add common substitutions, a general counter strategy, or details about this team by <a href={submissionForm}>submiting an issue.</a></small></p>)}
                {(counterStrategy) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to discuss counters a little further.</small></p>)}
              </>
            );
          }
          return (
            <>
            {(counterDescription)
              ? (<p><strong className="text-secondary">Specific Strategy: </strong>{counterDescription}</p>)
              : (<p className="text-secondary"><small>Do you know the strategy to beat the {oppTeamName} team with {name}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
            {(counterDescription) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
            </>
          );
        }
        if (side === 'right') {
          if (view === 'normal') {
            return (
              <>
                {(counterDescription)
                  ? (<p><strong className="text-secondary">Specific Strategy: </strong>{counterDescription}</p>)
                  : (<p className="text-secondary"><small>Do you know the strategy to beat the {name} team with {oppTeamName}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
                {(counterDescription) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
              </>
            );
          }
          return (
            <>
              {(oppDetails) ? (<p><strong className="text-secondary">Details: </strong>{oppDetails}</p>) : ''}
              {(oppCounterStrategy)
                ? (<p><strong className="text-secondary">General Strategy: </strong>{oppCounterStrategy}</p>)
                : (<p className="text-secondary"><small>You can help me add common substitutions, a general counter strategy, or details about this team by <a href={submissionForm}>submiting an issue.</a></small></p>)}
              {(oppCounterStrategy) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to discuss counters a little further.</small></p>)}
            </>
          );
        }
        return '';
      };

      return (
        <div className="countersDetails my-2" key={counterTeam.counterId}>
          <Collapse isOpen={counterTeam.counterId === collapse}>
            <div className="d-flex flex-row">

              {/* Left Side of Card */}
              <div className="detailsDivLeft col-6 border-dark border-right">
                <h6 className="text-secondary">{leftSideTitle}</h6>
                <h5>{name}</h5>
                <div className="detailsToonRow mb-2">
                  <img alt={leaderName} className="toonImg grayImg" title={leaderName} src={leaderImage} />
                  {(toon2Name) ? (<img alt={toon2Name} className="toonImg grayImg" title={toon2Name} src={toon2Image} />) : ''}
                  {(toon3Name) ? (<img alt={toon3Name} className="toonImg grayImg" title={toon3Name} src={toon3Image} />) : ''}
                  {(toon4Name) ? (<img alt={toon4Name} className="toonImg grayImg" title={toon4Name} src={toon4Image} />) : ''}
                  {(toon5Name) ? (<img alt={toon5Name} className="toonImg grayImg" title={toon5Name} src={toon5Image} />) : ''}
                </div>
                {(subs) ? (<p><small><strong className="text-secondary">Subs: </strong>{subs}</small></p>) : ''}
                {selectDescriptionData('left')}
              </div>

              {/* Right Side of Card */}
              <div className="detailsDivRight col-6">
                <h6 className="text-secondary">{rightSideTitle}</h6>
                <h5>{oppTeamName}</h5>
                <div className="detailsToonRow mb-2">
                  <img alt={oppLeaderName} className="toonImg grayImg" title={oppLeaderName} src={oppLeaderImage} />
                  {(oppToon2Name) ? (<img alt={oppToon2Name} className="toonImg grayImg" title={oppToon2Name} src={oppToon2Image} />) : ''}
                  {(oppToon3Name) ? (<img alt={oppToon3Name} className="toonImg grayImg" title={oppToon3Name} src={oppToon3Image} />) : ''}
                  {(oppToon4Name) ? (<img alt={oppToon4Name} className="toonImg grayImg" title={oppToon4Name} src={oppToon4Image} />) : ''}
                  {(oppToon5Name) ? (<img alt={oppToon5Name} className="toonImg grayImg" title={oppToon5Name} src={oppToon5Image} />) : ''}
                </div>
                {(oppSubs) ? (<p><small><strong className="text-secondary">Subs: </strong>{oppSubs}</small></p>) : ''}
                {selectDescriptionData('right')}
              </div>
            </div>
          </Collapse>
        </div>
      );
    });
  return matchupDetails;
}
