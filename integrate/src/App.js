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
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const { speak, cancel } = useSpeechSynthesis();
  useEffect(() => {
    if (isPlaying && result) {
      const utterance = new SpeechSynthesisUtterance(result);
      utterance.lang = 'en-US'; // For American English
      utterance.onboundary = (event) => {
        const charIndex = event.charIndex;
        let wordStartIndex = charIndex;
        let wordEndIndex = charIndex;

        // Find the start index of the current word
        while (wordStartIndex > 0 && !/\s/.test(result.charAt(wordStartIndex - 1))) {
          wordStartIndex--;
        }

        // Find the end index of the current word
        while (wordEndIndex < result.length - 1 && !/\s/.test(result.charAt(wordEndIndex + 1))) {
          wordEndIndex++;
        }

        const currentWord = result.substring(wordStartIndex, wordEndIndex + 1);
        const wordIndex = words.findIndex((word) => word === currentWord);
        setCurrentWordIndex(wordIndex);
      };
      speak(utterance);
    } else {
      cancel();
    }
  }, [isPlaying, result, speak, cancel, language, words]);
  

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
      setWords(text.split(/\s+/)); // Use a more robust word tokenization
      setCurrentWordIndex(-1); // Reset current word index
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: 'brown', fontFamily: 'Arial, sans-serif', fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', textDecoration: 'underline', margin: '20px', marginTop: '50px' }}>Text to speech converter in React</h1>
      <input type="file" onChange={onFileChange} className='fileInput' />
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
      <div style={{ marginTop: 25, marginLeft: -70, textAlign: 'center' }}>
        <input type="button" value="Submit" onClick={processImage} style={{
          backgroundColor: 'lightpurple',
          color: 'blue',
          border: '2px solid black',
          borderRadius: '5px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          justifyContent: 'center',
        }} />
      </div>
      <Container>
        <Segment>
          <button className='buttonStyle' onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </Segment>
      </Container>
      <div style={{ marginTop: 20, width: '60%', marginLeft: '662px' }}>
        <progress value={progress} max={1} style={{ width: '25%', height: '20px', borderRadius: '5px', backgroundColor: 'blue' }} />
      </div>
      {result !== '' && (
       <div className="mt-8 text-teal ml-64 text-2xl">
       Result: {words.map((word, index) => {
         console.log("Word:", word); // Log the content of each word
         return (
           <span key={index} className={index === currentWordIndex ? 'highlight' : ''}>
             {word}{' '}
           </span>
         );
       })}
     </div>
     
      )}
    </div>
  );
}

export default App;
