const mockGuild = {
  id: 'GUILD_123456789',
  name: 'MY_GUILD',
  guildTierUsers: 'PATREONUSER',
};

const mockGuildData = {
  isCurrentGuildInFirebase: true,
  isNowGuildTier: true,
};

const mockPlayer = {
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
};

export function mockCreateGuild() {
  console.log( 'run mockCreateGuild' );
  return mockGuild;
}

export function mockDeleteGuild() {
  console.log( 'run mockDeleteGuild' );
  return 'ok';
}

export function mockGetGuildById() {
  console.log( 'run mockGetGuildById' );
  return mockGuild;
}

export function mockGetUserByFirebaseAuthId() {
  console.log( 'run mockGetUserByFirebaseAuthId' );
  return {
    guildData: mockGuildData,
    firebaseUser: mockPlayer,
  };
}

export function mockGetPlayerDataFromSwgoh() {
  console.log( 'run mockGetPlayerDataFromSwgoh' );
  const playerData = require( './playerData.json' );
  return playerData;
}

export function mockPatreonCreate() {
  console.log( 'run mockPatreonCreate' );
  return {
    id: mockPlayer.id,
    email: mockPlayer.email,
  };
}

export function mockUnlinkPatreonAccount() {
  console.log( 'run mockUnlinkPatreonAccount' );
  return {
    ...mockPlayer,
    accessToken: '',
    expiresIn: '',
    patreonId: '',
    patreonStatus: '',
    refreshToken: '',
  };
}

export function mockUpdateGuild() {
  console.log( 'run mockUpdateGuild' );
  return 'ok';
}

export function mockUpdateUserInfo() {
  console.log( 'run mockUpdateUserInfo' );
  return mockPlayer;
}
