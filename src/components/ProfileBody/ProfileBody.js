import React from 'react';

import './ProfileBody.scss';

class ProfileBody extends React.Component {
  render() {
    const userData = this.props.userInfo.data;
    return (
      <div className="ProfileBody mx-2">
        <div className="pbHead">
          <div>
            <h6>Galactic Power: {userData.galactic_power.toLocaleString()}</h6>
            <h6>Guild: {userData.guild_name}</h6>
          </div>
        </div>
        <div>

        </div>
      </div>
    );
  }
}

export default ProfileBody;
