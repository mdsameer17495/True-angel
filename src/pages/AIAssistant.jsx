import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, AlertTriangle } from 'lucide-react';
import Header from '../components/Layout/Header';
import { voiceService } from '../services/voiceService';
import { parseIntent } from '../services/intentParser';
import { useAlarmStore, useMedicineStore, useReminderStore } from '../store';
import './AIAssistant.css';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I am True Angel. I can help you set alarms, add medicine reminders, and schedule tasks. Just tap the microphone or type below.' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Stores
  const { addAlarm } = useAlarmStore();
  const { addMedicine } = useMedicineStore();
  const { addReminder } = useReminderStore();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processInput = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    
    // Parse Intent
    const intent = parseIntent(text);
    
    // Execute Action
    if (intent.type === 'alarm') {
      addAlarm({ id: Date.now().toString(), ...intent.data, enabled: true });
    } else if (intent.type === 'medicine') {
      addMedicine({ id: Date.now().toString(), ...intent.data, takenToday: false });
    } else if (intent.type === 'reminder') {
      addReminder({ id: Date.now().toString(), ...intent.data, completed: false });
    }
    
    // Add AI Response & Speak
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: intent.reply }]);
      voiceService.speak(intent.reply);
    }, 600);
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    processInput(input);
    setInput('');
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (!voiceService.isSupported()) {
      setError('Voice input is not supported in your browser. Please type instead.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    setIsListening(true);
    recognitionRef.current = voiceService.startListening(
      (transcript) => {
        setIsListening(false);
        processInput(transcript);
      },
      (err) => {
        setIsListening(false);
        console.error(err);
        if (err !== 'no-speech') {
          setError('Failed to recognize voice. Try typing.');
          setTimeout(() => setError(''), 4000);
        }
      }
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="assistant-container">
      <Header title="AI Assistant" />
      
      {error && (
        <div className="bg-danger text-white p-sm flex-center gap-xs">
          <AlertTriangle size={16} />
          <span className="text-small">{error}</span>
        </div>
      )}

      <div className="chat-window">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper ${msg.type === 'user' ? 'message-right' : 'message-left'} animate-fadeInUp`}>
            {msg.type === 'ai' && (
              <div className="message-avatar bg-primary-light text-primary-dark">
                <Bot size={18} />
              </div>
            )}
            <div className={`message-bubble ${msg.type === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isListening && (
          <div className="message-wrapper message-left animate-fadeIn">
            <div className="message-avatar bg-primary-light text-primary-dark">
              <Bot size={18} />
            </div>
            <div className="message-bubble bubble-ai flex gap-sm">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <button 
          className={`mic-button ${isListening ? 'listening animate-pulse' : ''}`}
          onClick={toggleListening}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
        >
          <Mic size={24} />
          {isListening && <div className="mic-ring" />}
        </button>
        
        <div className="text-input-wrapper">
          <input 
            type="text" 
            placeholder="Type your request..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendText();
            }}
          />
          <button className="send-button" onClick={handleSendText} disabled={!input.trim()}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
