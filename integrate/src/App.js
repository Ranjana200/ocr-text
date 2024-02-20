import React, { useState, useEffect } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import Tesseract from 'tesseract.js';
import './styles.css';

function App() {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');
  const [language, setLanguage] = useState('eng');
  const [isPlaying, setIsPlaying] = useState(false);

  const { speak, cancel } = useSpeechSynthesis();

  useEffect(() => {
    if (isPlaying && result) {
      speak({ text: result });
    } else {
      cancel();
    }
  }, [isPlaying, result, speak, cancel]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processImage = () => {
    setProgress(0);
    Tesseract.recognize(file, language, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <h1>Text to speech converter in React</h1>
      <input type="file" onChange={onFileChange} className='fileInput'/>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className='selectStyle'
      >
        <option value="eng">English</option>
        <option value="tel">Telugu</option>
        <option value="hin">Hindi</option>
        <option value="kan">Kannada</option>
      </select>
      <div style={{ marginTop: 25,marginLeft:10,textAlign:'center' }}>
        <input type="button" value="Submit" onClick={processImage}  style={{
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      justifyContent:'center',

    }} />
      </div>
      <Container>
        <Segment> 
          <button className='buttonStyle' onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </Segment>
      </Container>
      <div style={{marginTop:20,width:'60%',marginLeft:'740px'}}>
        <progress value={progress} max={1} style={{width:'25%',height:'20px',borderRadius:'5px',backgroundColor:'#f3f3f3'}} />
      </div>
      {result !== '' && (
        <div style={{ marginTop: 20, fontSize: 18, color: 'teal',marginLeft:'40px' }}>
          Result: {result}
        </div>
      )}
    </div>
  );
}

export default App;
