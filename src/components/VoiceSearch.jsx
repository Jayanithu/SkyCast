import React, { useState } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const VoiceSearch = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const startListening = () => {
    setError('');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError(t('voiceNotSupported'));
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      setError(t('voiceError'));
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  const stopListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
    setIsListening(false);
  };

  return (
    <div className="voice-search">
      <button 
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        title={isListening ? t('stopListening') : t('startListening')}
      >
        {isListening ? <FaStop /> : <FaMicrophone />}
      </button>
      {error && <div className="voice-error">{error}</div>}
    </div>
  );
};

export default VoiceSearch;