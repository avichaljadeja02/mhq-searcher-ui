import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please upload a file');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
        setResult(result.validated_result);
      } else {
        console.error('File upload failed:', response.statusText);
        setResult(`File upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult(`Error uploading file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Query search successful:', result);
        setResult(result.validated_result);
      } else {
        console.error('Query search failed:', response.statusText);
        setResult(`Query search failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error searching query:', error);
      setResult(`Error searching query: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="MHQ-searcher">
      <h1>MHQ Searcher</h1>
      <form className="form" onSubmit={handleFileUpload}>
        <div className="form-group">
          <label htmlFor="fileInput">Upload PDF:</label>
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
        <button className="btn" type="submit">Upload File</button>
      </form>
      <form className="form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="queryInput">Search Query:</label>
          <input
            type="text"
            id="queryInput"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
        <button className="btn" type="submit">Search</button>
      </form>
      {loading && (
        <div className="loader-overlay">
          <div className="loader">Loading...</div>
        </div>
      )}
      <div className="result-box">
        <h2>Result:</h2>
        <textarea value={result} readOnly />
      </div>
    </div>
  );
}

export default App;
