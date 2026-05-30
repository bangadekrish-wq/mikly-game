import React, { useEffect, useState } from 'react';

const ScoreBoard = ({ score }) => {
  const [motivation, setMotivation] = useState(null);
  const timerRef = React.useRef(null);

  useEffect(() => {
    let msg = null;
    if (score === 6) msg = "tera lund chota";
    else if (score === 10) msg = "hila le";
    else if (score === 16) msg = "lund nahi hoga";
    else if (score === 20) msg = "chut mari ke";

    if (msg) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMotivation(msg);
      timerRef.current = setTimeout(() => {
        setMotivation(null);
      }, 3500);
    }
  }, [score]);

  // Only clear on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <div className="score-board">
        {score}
      </div>
      
      {motivation && (
        <div className="motivational-msg">
          {motivation}
        </div>
      )}
    </>
  );
};

export default ScoreBoard;
