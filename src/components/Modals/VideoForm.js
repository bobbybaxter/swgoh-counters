import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, Input, Label,
} from 'reactstrap';
import { isWebUri } from 'valid-url';

export const FormVideo = styled(FormGroup)`
  display: flex;
  flex-direction: row;
  text-align: left;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #343a40;
  padding-top: 1rem;
`;

export default function VideoForm({
  checkIfVideoLinksAreValid,
  setAreVideoTitlesTooLong,
  setVideoLinks,
  videoLinks,
  ...props
}) {
  VideoForm.propTypes = {
    checkIfVideoLinksAreValid: PropTypes.func.isRequired,
    setAreVideoTitlesTooLong: PropTypes.func.isRequired,
    setVideoLinks: PropTypes.func.isRequired,
    videoLinks: PropTypes.array.isRequired,
  };

  const addVideo = (e) => {
    e.preventDefault();
    const defaultVideoLink = {
      id: Math.random().toString(36).substring(7),
      link: '',
      title: '',
    };
    const tempVideoLinks = [...videoLinks];
    tempVideoLinks.push(defaultVideoLink);
    setVideoLinks(tempVideoLinks);
    checkIfVideoLinksAreValid(tempVideoLinks);
  };

  const removeVideo = (e) => {
    e.preventDefault();
    const tempVideoLinks = [...videoLinks];
    tempVideoLinks.splice(e.target.dataset.idx, 1, {
      ...tempVideoLinks[e.target.dataset.idx],
      link: 'https://w', // sets a "deleted" link to a valid link to enable submit button
      title: 'deleted', // adds title for submit button validation
      deleteVideo: true,
    });
    setVideoLinks(tempVideoLinks);
    checkIfVideoLinksAreValid(tempVideoLinks);
  };

  const handleChange = (e) => {
    if (['title', 'link'].includes(e.target.dataset.property)) {
      const tempVideoLinks = [...videoLinks];
      tempVideoLinks[e.target.dataset.idx][e.target.dataset.property] = e.target.value;
      setVideoLinks(tempVideoLinks);
      checkIfVideoLinksAreValid(tempVideoLinks);
      if (tempVideoLinks.some(videoLink => videoLink.title.length > 50)) {
        setAreVideoTitlesTooLong(true);
      } else {
        setAreVideoTitlesTooLong(false);
      }
    }
  };

  return (
      <Wrapper>
        <h6 className="text-secondary pb-3">Video Links</h6>
        <div className="d-flex flex-row">
          <h6 className="col-5 text-secondary mr-1"><small>Title</small></h6>
          <h6 className="col-6 text-secondary mr-1"><small>Link</small></h6>
        </div>
        {
          videoLinks.map((videoLink, i) => {
            const { id } = videoLink;
            return !videoLink.deleteVideo && <div key={`${i}_${id}`}>
                <div className="d-flex flex-row pb-3">
                  <Label for={`title_${i}`} />
                  <Input
                    data-idx={i}
                    data-property="title"
                    className="col-5 mr-1"
                    name={`videoTitle_${i}`}
                    type="text"
                    value={videoLinks[i].title}
                    onChange={handleChange}
                  />
                  <Label for={`link_${i}`} />
                  <Input
                    data-idx={i}
                    data-property="link"
                    className="col-6 mr-1"
                    name={`videoLink_${i}`}
                    type="text"
                    value={videoLinks[i].link}
                    onChange={handleChange}
                  />
                  <Button data-idx={i} className="col-1" onClick={removeVideo}>-</Button>
                </div>
                <div>
                  {videoLinks[i].title.length > 50 && <div className="alert alert-danger">Title is too long</div>}
                  {videoLinks[i].title.length === 0 && <div className="alert alert-danger">No title entered</div>}
                  {!isWebUri(videoLinks[i].link) && <div className="alert alert-danger">Not a valid link <br/><small>("http://" or "https://" required)</small></div>}
                </div>
              </div>;
          })
        }
        <Button className="col-5 justify-self-start" onClick={addVideo}>+</Button>
      </Wrapper>
  );
}
