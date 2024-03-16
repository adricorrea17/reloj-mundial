import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const Reloj = () => {
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timezoneResponse = await fetch('https://worldtimeapi.org/api/timezone');
        const timezones = await timezoneResponse.json();

        const promises = timezones.map(async (timezone) => {
          const timeResponse = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
          return await timeResponse.json();
        });

        const results = await Promise.all(promises);
        setTimeData(results.map((result) => ({
          timezone: result.timezone,
          time: result.datetime.slice(11, 16)
        })));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching time data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const filteredTimeData = timeData ? timeData.filter((timezone) => timezone.timezone.includes(selectedCountry)) : [];

  const localTime = moment().format('HH:mm');

  return (
    <div className='flex flex-col items-center gap-10 container mx-auto flex py-44'>
      <div className='border-4 border-teal-400 mt-3 w-96 mx-auto rounded-full h-96 bg-gray-900 shadow-2xl shadow-cyan-500/50 flex justify-center items-center'>
        {selectedCountry === '' ? (
          <label className='text-center text-6xl text-teal-400' key="local">{localTime}</label>
        ) : (
          filteredTimeData.map((timezone) => (
              <label className='text-center text-6xl text-teal-400'>{timezone.time}</label>
          ))
        )}
      </div>
      <select className='bg-gray-900 border-2 border-teal-400 text-teal-400 py-2 px-4 rounded-xl' onChange={handleChange}>
        <option value="">Seleccione un país</option>
        {timeData.map((timezone) => (
          <option key={timezone.timezone} value={timezone.timezone}>
            {timezone.timezone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Reloj;