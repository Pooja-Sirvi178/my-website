import {useEffect, useState} from 'react';
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [inputText, setInputText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchMessage = () => {
    axios.get('http://localhost:5000/api/home')
    .then(res => setMessage(res.data.message))
    .catch(err => {
      console.error(err);
      setMessage('Could not reach server.');
    });
  }
  
  const fetchAllMessages = () => {
    axios.get('http://localhost:5000/api/home/all')
    .then(res => setAllMessages(res.data.messages))
    .catch(err => {
      console.error(err);
    });
  }

  useEffect( () => {
    fetchMessage();
    fetchAllMessages();
  } , [] );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if(inputText.trim() === '') {
      setError("Please enter a message before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5000/api/home', {
        text : inputText
      });
      setMessage(res.data.message);
      fetchAllMessages();
      setInputText('');
    } catch(err) {
      console.error(err);
      setError('Failed to save message.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/home/${id}`);
      fetchAllMessages();
    } catch(error) {
      console.error(error);
      setError('Failed to delete message.');
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleUpdate = async(id) => {
    if(editText.trim() === '') {
      setError('Message text is required.');
      return;
    }

    try{
      await axios.put(`http://localhost:5000/api/home/${id}`, {text: editText});
      setEditingId(null);
      setEditText('');
      fetchMessage();
      fetchAllMessages();
    } catch(error) {
      setError("Failed to update message.");
    }
  };

  return(
    <div className="app">
      <h1>Welcome to Our Website</h1>
      <p>{message}</p>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a new message"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Submit'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <br/>
      <h2>All Messages</h2>
      <ul className="message-list">
        {allMessages.map((msg) => {
          return <li key={msg._id}>
            {editingId === msg._id ? (
              <div className='edit-row'>
                <input 
                  type="text" 
                  value={editText} 
                  onChange={(e) => { setEditText(e.target.value)}} 
                />
                <button onClick={() => handleUpdate(msg._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className='view-row'>
                <span>{msg.text}</span>
                <div className='actions'>
                  <button onClick={() => startEdit(msg)}>Edit</button>
                  <button onClick={() => handleDelete(msg._id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        })}
      </ul>
    </div>
  );
}

export default Home;
