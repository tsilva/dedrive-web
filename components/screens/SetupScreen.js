'use client';

import { useState } from 'react';

export default function SetupScreen({ clientId, onSave }) {
  const [value, setValue] = useState(clientId || '');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
  }

  return (
    <div className="screen">
      <div className="setup-container">
        <div className="setup-title">Setup</div>
        <div className="setup-desc">
          Dedrive finds and manages duplicate files in your Google Drive.
          It runs entirely in your browser &mdash; no data leaves your machine.
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="client-id-input">OAuth Client ID</label>
            <input
              className="input"
              id="client-id-input"
              type="text"
              placeholder="123456789.apps.googleusercontent.com"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Save &amp; Continue</button>
        </form>
        <div className="setup-steps">
          <h3>How to get a Client ID</h3>
          <ol>
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Google Cloud Console &rarr; Credentials</a></li>
            <li>Create a new project (or select existing)</li>
            <li>Enable the <strong>Google Drive API</strong></li>
            <li>Configure the <strong>OAuth consent screen</strong> (External, add your email as test user)</li>
            <li>Create an <strong>OAuth 2.0 Client ID</strong> (type: Web application)</li>
            <li>Add your site URL as an <strong>Authorized JavaScript origin</strong> (e.g. <code>http://localhost:3000</code>)</li>
            <li>Copy the Client ID and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
