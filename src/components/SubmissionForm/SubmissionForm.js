import React from 'react';
import MetaTags from 'react-meta-tags';

import './SubmissionForm.scss';

export default function SubmissionForm() {
  return (
    <div className="SubmissionForm">
      <MetaTags>
        <title>Submission Form</title>
        <meta name="description" content="Submit new counter ideas or changes to the current meta"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
      <iframe
        title="submissionForm"
        src="https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?usp=sf_link"
        width="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
      >
        Loading...
      </iframe>
    </div>
  );
}
