// import axios from 'axios';

// const getCounters = () => new Promise((resolve, reject) => {
//   axios.get('https://api.sheety.co/e505ae20-ec5b-46e8-a86f-7149b9823b64')
//     .then((res) => {
//       resolve(res.data);
//     })
//     .catch(err => reject(err));
// });

// export default { getCounters };

const getCounters = async () => {
  const response = await fetch('api/counters');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  console.log('body :>> ', body);
  return body;
};

export default { getCounters };
