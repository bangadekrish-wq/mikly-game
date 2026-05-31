import React from 'react';

const MainMenu = ({ onStart, highScore, selectedBird, setSelectedBird, soundEnabled, setSoundEnabled }) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, backgroundColor: 'rgba(88, 199, 243, 0.9)' // sky blue fallback
    }}>
      {/* Top HUD */}
      <div style={{ position: 'absolute', top: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box' }}>
        <div style={{ background: '#45505e', border: '3px solid #282f3a', borderRadius: '10px', padding: '5px 15px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          🪙 0
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: '#45505e', border: '3px solid #282f3a', borderRadius: '10px', width: '45px', height: '45px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontSize: '1.2rem' }}>
            {soundEnabled ? '🔊' : '🔇'}
          </div>
          
          <div style={{ background: '#45505e', border: '3px solid #282f3a', borderRadius: '10px', padding: '5px 15px', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#ffdf00' }}>BEST</div>
            <div style={{ fontSize: '1.2rem' }}>{highScore}</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 style={{ 
        fontFamily: 'Impact, sans-serif', fontSize: 'clamp(2.5rem, 15vw, 4rem)', color: 'white', 
        textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 5px 0 #000',
        marginBottom: '20px', textAlign: 'center', lineHeight: '1'
      }}>
        Manjil<br/>Milky
      </h1>

      {/* Bird Selection & Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <div style={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 0 #000', fontSize: '1.2rem', marginBottom: '5px' }}>
          Select Your Character
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div onClick={() => setSelectedBird('/bird.png')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', transform: selectedBird === '/bird.png' ? 'scale(1.2)' : 'scale(1)', opacity: selectedBird === '/bird.png' ? 1 : 0.5 }}>
            <img src="/bird.png" alt="Kshitij" style={{ width: 'clamp(60px, 20vw, 80px)', height: 'clamp(60px, 20vw, 80px)', objectFit: 'contain' }} />
            <div style={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 0 #000', marginTop: '5px' }}>Kshitij</div>
          </div>
          <div onClick={() => setSelectedBird('/bird2.png')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', transform: selectedBird === '/bird2.png' ? 'scale(1.2)' : 'scale(1)', opacity: selectedBird === '/bird2.png' ? 1 : 0.5 }}>
            <img src="/bird2.png" alt="Manjil" style={{ width: 'clamp(60px, 20vw, 80px)', height: 'clamp(60px, 20vw, 80px)', objectFit: 'contain' }} />
            <div style={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 0 #000', marginTop: '5px' }}>Manjil</div>
          </div>
          <div onClick={() => setSelectedBird('/bird3.png')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', transform: selectedBird === '/bird3.png' ? 'scale(1.2)' : 'scale(1)', opacity: selectedBird === '/bird3.png' ? 1 : 0.5 }}>
            <img src="/bird3.png" alt="Abhinav" style={{ width: 'clamp(60px, 20vw, 80px)', height: 'clamp(60px, 20vw, 80px)', objectFit: 'contain' }} />
            <div style={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 0 #000', marginTop: '5px' }}>Abhinav</div>
          </div>
          <div onClick={() => setSelectedBird('/bird4.png')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', transform: selectedBird === '/bird4.png' ? 'scale(1.2)' : 'scale(1)', opacity: selectedBird === '/bird4.png' ? 1 : 0.5 }}>
            <img src="/bird4.png" alt="Shabbir" style={{ width: 'clamp(60px, 20vw, 80px)', height: 'clamp(60px, 20vw, 80px)', objectFit: 'contain' }} />
            <div style={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 0 #000', marginTop: '5px' }}>Shabbir</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', animation: 'float 1s ease-in-out infinite alternate' }}>
          <div style={{ fontSize: '1.5rem' }}>👆</div>
          <div style={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 0 #000', fontSize: '1.2rem', marginTop: '-5px' }}>TAP TO FLY</div>
        </div>
      </div>

      {/* Play Button */}
      <button onClick={onStart} style={{ 
        background: 'white', border: '4px solid #282f3a', borderRadius: '15px', 
        width: '180px', height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer', boxShadow: '0 5px 0 #282f3a', marginBottom: '15px'
      }}>
        <div style={{ width: '0', height: '0', borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderLeft: '35px solid #7cb342' }}></div>
      </button>

      {/* Install App Button */}
      {deferredPrompt && (
        <button onClick={handleInstallClick} style={{ 
          background: '#ff4757', border: '4px solid #282f3a', borderRadius: '15px', 
          width: '180px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', boxShadow: '0 4px 0 #282f3a', marginBottom: '15px',
          color: 'white', fontWeight: '900', fontSize: '1.1rem'
        }}>
          INSTALL APP
        </button>
      )}

      {/* Leaderboard Button */}
      <button style={{ 
        background: 'white', border: '4px solid #282f3a', borderRadius: '15px', 
        width: '180px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer', boxShadow: '0 4px 0 #282f3a', marginBottom: '30px',
        color: '#e65100', fontWeight: '900', fontSize: '1.1rem'
      }}>
        LEADERBOARD
      </button>

      {/* Bottom Buttons */}
      <div style={{ display: 'flex', gap: '15px' }}>
        {['🏆', '📊', '🛒', '⚙️'].map((icon, i) => (
          <button key={i} style={{ 
            background: ['#ffb300', '#29b6f6', '#81c784', '#ba68c8'][i], 
            border: '4px solid #282f3a', borderRadius: '12px', width: '50px', height: '50px', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem',
            cursor: 'pointer', boxShadow: '0 4px 0 #282f3a'
          }}>
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
