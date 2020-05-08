import React from 'react';
import { Collapse } from 'reactstrap';

export default function BuildDescriptions(props) {
  const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
  const discordLink = 'https://discord.gg/eCnE48h';
  const { collapse, counterTeams, squadWithCharData } = props;
  const matchupDetails = counterTeams
    .map(counterTeam => (
        <div className="countersDetails my-2" key={counterTeam.counterId}>
          <Collapse isOpen={counterTeam.counterId === collapse}>
            <div className="d-flex flex-row">
              <div className="detailsDivLeft col-6 border-dark border-right">

                {/* Left Side of Card */}
                <h6 className="text-secondary">Opponent Team</h6>
                <h5>{squadWithCharData.name}</h5>
                <div className="detailsToonRow mb-2">
                  <img alt={squadWithCharData.leaderName} className="toonImg opponentImg" title={squadWithCharData.leaderName} src={squadWithCharData.leaderImage} />
                  {(squadWithCharData.toon2Name) ? (<img alt={squadWithCharData.toon2Name} className="toonImg opponentImg" title={squadWithCharData.toon2Name} src={squadWithCharData.toon2Image} />) : ''}
                  {(squadWithCharData.toon3Name) ? (<img alt={squadWithCharData.toon3Name} className="toonImg opponentImg" title={squadWithCharData.toon3Name} src={squadWithCharData.toon3Image} />) : ''}
                  {(squadWithCharData.toon4Name) ? (<img alt={squadWithCharData.toon4Name} className="toonImg opponentImg" title={squadWithCharData.toon4Name} src={squadWithCharData.toon4Image} />) : ''}
                  {(squadWithCharData.toon5Name) ? (<img alt={squadWithCharData.toon5Name} className="toonImg opponentImg" title={squadWithCharData.toon5Name} src={squadWithCharData.toon5Image} />) : ''}
                </div>
                {(squadWithCharData.subs) ? (<p><small><strong className="text-secondary">Subs: </strong>{squadWithCharData.subs}</small></p>) : ''}
                {(squadWithCharData.description) ? (<p><strong className="text-secondary">Details: </strong>{squadWithCharData.description}</p>) : ''}
                {(squadWithCharData.counterStrategy) ? (<p><strong className="text-secondary">General Strategy: </strong>{squadWithCharData.counterStrategy}</p>) : (<p className="text-secondary"><small>You can help me add common substitutions, a general counter strategy, or details about this team by <a href={submissionForm}>submiting an issue.</a></small></p>)}
                {(squadWithCharData.counterStrategy) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to discuss counters a little further.</small></p>)}
              </div>

              {/* Right Side of Card */}
              <div className="detailsDivRight col-6">
                <h6 className="text-secondary">Counter Team</h6>
                <h5>{counterTeam.counterTeamName}</h5>
                <div className="detailsToonRow mb-2">
                  <img alt={counterTeam.oppLeaderName} className="toonImg opponentImg" title={squadWithCharData.oppLeaderName} src={counterTeam.oppLeaderImage} />
                  {(counterTeam.oppToon2Name) ? (<img alt={counterTeam.oppToon2Name} className="toonImg opponentImg" title={counterTeam.toon2Name} src={counterTeam.oppToon2Image} />) : ''}
                  {(counterTeam.oppToon3Name) ? (<img alt={counterTeam.oppToon3Name} className="toonImg opponentImg" title={counterTeam.toon3Name} src={counterTeam.oppToon3Image} />) : ''}
                  {(counterTeam.oppToon4Name) ? (<img alt={counterTeam.oppToon4Name} className="toonImg opponentImg" title={counterTeam.toon4Name} src={counterTeam.oppToon4Image} />) : ''}
                  {(counterTeam.oppToon5Name) ? (<img alt={counterTeam.oppToon5Name} className="toonImg opponentImg" title={counterTeam.toon5Name} src={counterTeam.oppToon5Image} />) : ''}
                </div>
                {(counterTeam.subs) ? (<p><small><strong className="text-secondary">Subs: </strong>{counterTeam.subs}</small></p>) : ''}
                {(counterTeam.description) ? (<p><strong className="text-secondary">Strategy: </strong>{counterTeam.description}</p>) : (<p className="text-secondary"><small>Do you know the strategy to beat the {squadWithCharData.name} team with {counterTeam.counterTeamName}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
                {(counterTeam.description) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
              </div>
            </div>
          </Collapse>
        </div>
    ));
  return matchupDetails;
}
