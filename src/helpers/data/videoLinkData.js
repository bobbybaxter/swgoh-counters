const baseUrl = process.env.REACT_APP_VIDEOLINK_API_URL;

export async function addVideoLink(videoLink) {
  try {
    await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': ['application/json'],
      },
      body: JSON.stringify(videoLink),
    });

    return 'ok';
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateVideoLink(videoLink) {
  try {
    await fetch(`${baseUrl}/${videoLink.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': ['application/json'],
      },
      body: JSON.stringify(videoLink),
    });

    return 'ok';
  } catch (err) {
    throw new Error(err);
  }
}

export async function deleteVideoLink(videoLink) {
  try {
    await fetch(`${baseUrl}/${videoLink.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': ['application/json'],
      },
      body: JSON.stringify(videoLink),
    });

    return 'ok';
  } catch (err) {
    throw new Error(err);
  }
}
