import React, { memo } from 'react';
import { GetPremium } from '../../features/monetization';

const AppBarComponent: React.FC = () => {
  console.log('AppBar render');
  const walletBalance = 1250;

  const handleMinimize = () => {
    overwolf.windows.getCurrentWindow((res) => {
      overwolf.windows.minimize(res.window.id);
    });
  };

  const handleClose = () => {
    overwolf.windows.getCurrentWindow((res) => {
      overwolf.windows.close(res.window.id);
    });
  };

  const handleGetPremium = () => {
  window.dispatchEvent(
    new CustomEvent('navigate', {
      detail: 'premiumContent',
    })
  );
};

  return (
    <div
      style={{
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        background: '#151824',
        color: '#fff',
        ['WebkitAppRegion' as any]: 'drag',
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        Questboard
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          ['WebkitAppRegion' as any]: 'no-drag',
        }}
      >
        <div
          style={{
            background: '#22283b',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          💰 {walletBalance}
        </div>

        <button
          onClick={handleGetPremium}
          style={{
            background: '#B8F36B',
            color: '#111',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Get Premium ↗
        </button>

        <button
          onClick={handleMinimize}
          style={{
            width: '30px',
            height: '30px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          —
        </button>

        <button
          onClick={handleClose}
          style={{
            width: '30px',
            height: '30px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const AppBar = memo(AppBarComponent);
