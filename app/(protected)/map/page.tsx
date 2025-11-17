'use client';

import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

const Map = () => {
  return <MapClient />;
};

export default Map;
