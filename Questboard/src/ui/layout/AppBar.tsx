import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/store';

const AppBarComponent: React.FC = () => {
  const walletBalance = useSelector(
    (state: RootState) => state.profile.data?.wallet?.coinBalance ?? 0,
  );
  console.log('APPBAR RENDER', walletBalance);

  const handleMinimize = () => {
    overwolf.windows.getCurrentWindow((res) => {
      overwolf.windows.minimize(res.window.id);
    });
  };

  // const handleClose = () => {
  //   overwolf.windows.getCurrentWindow((res) => {
  //     overwolf.windows.close(res.window.id);
  //   });
  // };

  const handleClose = () => {
    overwolf.windows.getCurrentWindow((res) => {
      overwolf.windows.hide(res.window.id);
    });
  };

  const handleGetPremium = () => {
    window.dispatchEvent(
      new CustomEvent('navigate', {
        detail: 'premiumContent',
      }),
    );
  };

  const controlButtonStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#1d2233',
    border: '1px solid #2a3145',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s ease',
  };

  return (
    <div
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: '#151824',
        borderBottom: '1px solid #23293d',
        color: '#fff',
        ['WebkitAppRegion' as any]: 'drag',
      }}
    >
      {/* LOGO */}
      <div
        style={{
          fontWeight: 900,
          fontSize: '18px',
          letterSpacing: '1px',
          marginLeft: '6px', // shifts slightly right
          background: 'linear-gradient(135deg,#B8F36B,#4ade80)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        AURUM
      </div>

      {/* ACTIONS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          ['WebkitAppRegion' as any]: 'no-drag',
        }}
      >
        {/* WALLET */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#1d2233',
            border: '1px solid #2a3145',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
          }}
        >
          <span style={{ fontSize: '14px' }}>🪙</span>
          <span>{walletBalance?.toLocaleString()}</span>
        </div>

        {/* PREMIUM */}
        {/* <button
          onClick={handleGetPremium}
          style={{
            background: 'linear-gradient(135deg,#B8F36B 0%,#9BEF4C 100%)',
            color: '#111',
            border: 'none',
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 18px rgba(184,243,107,.25)',
            transition: 'all .2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 0 24px rgba(184,243,107,.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 18px rgba(184,243,107,.25)';
          }}
        >
          Get Premium ↗
        </button> */}

        {/* MINIMIZE */}
        <button
          onClick={handleMinimize}
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#27304a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1d2233';
          }}
        >
          —
        </button>

        {/* CLOSE */}
        <button
          onClick={handleClose}
          style={{
            ...controlButtonStyle,
            color: '#ef4444',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#3b1d1d';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1d2233';
            e.currentTarget.style.borderColor = '#2a3145';
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const AppBar = memo(AppBarComponent);
