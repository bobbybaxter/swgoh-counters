import React from 'react';

import './SubmissionForm.scss';

class SubmissionForm extends React.Component {
  render() {
    return (
      <div>
        <iframe className="submissionForm" title="submissionForm" src="https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true">Loading…</iframe>
      </div>
    );
  }
}

export default SubmissionForm;
