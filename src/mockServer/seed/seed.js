import stubsBySquadIds from './getStubsBySquadIds.json';

export default function seed( server ) {
  server.create( 'guild', {
    id: 'GUILD_123456789',
    name: 'MY_GUILD',
    guildTierUsers: 'PATREONUSER',
  } );

  server.create( 'guildInfo', {
    isCurrentGuildInFirebase: true,
    isNowGuildTier: true,
  } );

  server.create( 'player', {
    id: 'PATREONUSER',
    accessToken: 'ACCESS_TOKEN',
    allyCode: '111111111',
    discordId: 'DISCORD_123456789',
    email: 'PATREONUSER@mockemail.com',
    expiresIn: '2022-04-15T14:11:04.905Z',
    guildId: 'GUILD_123456789',
    guildName: 'MY_GUILD',
    patreonId: '99999999',
    patronStatus: 'Active Patron',
    refreshToken: 'REFRESH_TOKEN',
    tier: 'Aurodium',
    username: 'Patreon User',
  } );

  stubsBySquadIds.forEach( stub => {
    server.create( 'stub', stub );
  } );
}
