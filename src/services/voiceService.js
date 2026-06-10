// Wrapper for Web Speech API — with bilingual support (en-US / hi-IN)

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const voiceService = {
  isSupported: () => !!SpeechRecognition,

  /**
   * Start listening with the given language code.
   * @param {object} options
   * @param {string} options.lang - BCP-47 language code, e.g. 'en-US' or 'hi-IN'
   * @param {function} options.onResult - Called with final transcript string
   * @param {function} options.onInterim - Called with interim (partial) transcript string
   * @param {function} options.onError - Called with error string
   * @returns {SpeechRecognition|null} recognition instance (call .stop() to cancel)
   */
  startListening: ({ lang = 'en-US', onResult, onInterim, onError } = {}) => {
    if (!SpeechRecognition) {
      if (onError) onError('not-supported');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable live transcript
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Send interim results for live display
      if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }

      // Send final result
      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      // If recognition ended without producing a final result,
      // notify via onError so UI can reset
    };

    try {
      recognition.start();
    } catch {
      if (onError) onError('start-failed');
      return null;
    }

    return recognition;
  },

  /**
   * Speak text aloud using the SpeechSynthesis API.
   * @param {string} text - The text to speak
   * @param {string} lang - Language code (e.g. 'en-US' or 'hi-IN')
   */
  speak: (text, lang = 'en-US') => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  },

  /**
   * Stop any ongoing speech.
   */
  stopSpeaking: () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
};
