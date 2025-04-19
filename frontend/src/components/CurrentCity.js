import { useEffect, useState } from 'react';
import axios from 'axios';

const useCurrentCity = () => {
  const [city, setCity] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const location = response.data.address;
            setCity(location.city || location.town || location.village || 'Unknown');
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setCity('Unknown');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCity('Permission denied');
        }
      );
    } else {
      console.error('Geolocation not available');
      setCity('Not supported');
    }
  }, []);

  return city;
};

export default useCurrentCity;