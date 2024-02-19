import React, { useState, useEffect } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import Tesseract from 'tesseract.js';

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
      <input type="file" onChange={onFileChange} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="eng">English</option>
        <option value="tel">Telugu</option>
        <option value="hin">Hindi</option>
        <option value="kan">Kannada</option>
      </select>
      <div style={{ marginTop: 25 }}>
        <input type="button" value="Submit" onClick={processImage} />
      </div>
      <Container>
        <Segment> 
          <button className="buttonStyle" onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </Segment>
      </Container>
      <div>
        <progress value={progress} max={1} />
      </div>
      {result !== '' && (
        <div style={{ marginTop: 20, fontSize: 18, color: 'teal' }}>
          Result: {result}
        </div>
      )}
    </div>
  );
}

export default App;
