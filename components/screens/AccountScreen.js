'use client';

export default function AccountScreen({ user, onSignIn, onSignOut, onStartScan }) {
  return (
    <div className="screen">
      <div className="login-container">
        <div className="setup-title" style={{ marginBottom: 24 }}>Account</div>
        {user && (
          <div className="user-card">
            {user.photoLink && (
              <img src={user.photoLink} className="user-avatar" alt="" />
            )}
            <div>
              <div className="user-name">{user.displayName}</div>
              <div className="user-email">{user.emailAddress}</div>
            </div>
          </div>
        )}
        <div className="login-actions">
          {!user && (
            <button className="btn btn-primary" onClick={onSignIn}>
              Sign in with Google
            </button>
          )}
          {user && (
            <>
              <button className="btn" onClick={onSignOut}>Sign Out</button>
              <button className="btn btn-primary" onClick={onStartScan}>Start Scan</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
