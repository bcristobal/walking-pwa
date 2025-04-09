// src/pages/map/[challengeId]/[participationId].tsx or .astro

import React, { useEffect, useState } from 'react';
import LayoutMap from '../../layouts/LayoutMap.astro';
import MyMap from '../map/MyMap';
import ProtectedRoute from '../auth/ProtectedRoute';

const ChallengeMapPage = () => {
  const [params, setParams] = useState({
    challengeId: '',
    participationId: ''
  });
  
  useEffect(() => {
    // Extract the challenge ID and participation ID from the URL
    const pathname = window.location.pathname;
    const segments = pathname.split('/');
    
    // Assuming URL structure: /map/{challengeId}/{participationId}
    if (segments.length >= 4) {
      setParams({
        challengeId: segments[2],
        participationId: segments[3]
      });
    } else {
      // Handle error state or redirect
      console.error("Missing required parameters in URL");
      // Could redirect to challenges page
      // window.location.href = '/challenges';
    }
  }, []);

  if (!params.challengeId || !params.participationId) {
    return <div className="loading">Loading challenge data...</div>;
  }

  return (
    <MyMap 
      participation_id={params.participationId} 
      challenge_id={params.challengeId} 
    />
  );
};

export default ChallengeMapPage;