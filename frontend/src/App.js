import React, { useEffect, useState } from 'react';
import { getApiRoot } from './api';

const App = () => {
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiRoot();
        setApiResponse(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Smart Incident Management System</h1>
      <p>API Response: {apiResponse}</p>
    </div>
  );
};

export default App;
