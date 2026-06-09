// Wrapper for Web Speech API

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const voiceService = {
  isSupported: () => !!SpeechRecognition,
  
  startListening: (onResult, onError) => {
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return null;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };
    
    recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };
    
    recognition.start();
    return recognition;
  },

  speak: (text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
};
