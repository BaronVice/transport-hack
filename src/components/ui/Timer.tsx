import { useEffect, useState } from 'react'

const Timer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-white text-6xl font-bold">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Timer;
