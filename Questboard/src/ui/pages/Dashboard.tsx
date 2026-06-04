export const Dashboard: React.FC = () => {
  overwolf.windows.getCurrentWindow((r) => {
    console.log('CURRENT WINDOW:', r);
  });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
        }}
      >
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div style={{ color: '#4ade80', fontSize: '14px' }}>● Live</div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: '#151824',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#888' }}>Total Quests</div>
          <div
            style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}
          >
            0
          </div>
        </div>
        <div
          style={{
            background: '#151824',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#888' }}>Completed</div>
          <div
            style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}
          >
            0
          </div>
        </div>
        <div
          style={{
            background: '#151824',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#888' }}>In Progress</div>
          <div
            style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}
          >
            0
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          background: '#151824',
          padding: '16px',
          borderRadius: '8px',
          flex: 1,
        }}
      >
        <p>Your quest content will appear here</p>
      </div>
    </div>
  );
};
