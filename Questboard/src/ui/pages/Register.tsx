import { useState } from 'react';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log('REGISTER:', { username, email, password });
    alert('Register clicked (connect backend later)');
  };

  const handleGoLogin = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
  };

  return (
    <div
      style={{
        maxWidth: '350px',
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '10px' }}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px' }}
      />

      <button onClick={handleRegister} style={{ padding: '10px', cursor: 'pointer' }}>
        Create Account
      </button>

      <p style={{ fontSize: '12px' }}>
        Already have an account?
        <a href="#" onClick={(e) => { e.preventDefault(); handleGoLogin(); }} style={{ marginLeft: '5px' }}>
          Login
        </a>
      </p>
    </div>
  );
};
