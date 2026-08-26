import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function About() {
  const { token } = useAuth();
  const [bio, setBio] = useState('Loading...');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  const fetchAbout = () => {
    axios.get('http://localhost:5000/api/about')
      .then(res => setBio(res.data.bio))
      .catch(err => {
        console.error(err);
        setBio('Could not reach server.');
      });
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const startEdit = () => {
    setEditText(bio);
    setEditing(true);
  };

  const handleSave = async () => {
    if (editText.trim() === '') {
      setError('Bio text is required.');
      return;
    }
    try {
      const res = await axios.put('http://localhost:5000/api/about',
        { bio: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBio(res.data.bio);
      setEditing(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update bio.');
    }
  };

  return (
    <div className="app">
      <h1>About</h1>

      {editing ? (
        <div className="edit-row">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={handleSave}  className='btn'>Save</button>
          <button onClick={() => setEditing(false)}  className='btn'>Cancel</button>
        </div>
      ) : (
        <div>
          <p>{bio}</p>
          <br />
          {token && <button onClick={startEdit} className='btn'>Edit Bio</button>}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default About;