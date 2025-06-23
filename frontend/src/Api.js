import axios from 'axios';

export const fetchJobs = async (q = '', status = '') => {
  const { data } = await axios.get('/api/jobs', {
    params: { search: q, status },
  });
  return data;            // [{ id, title, company, … }]
};
