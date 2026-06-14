import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Bot, AlertTriangle } from 'lucide-react';
import Header from '../components/Layout/Header';
import { voiceService } from '../services/voiceService';
import { parseIntent } from '../services/intentParser';
import { useAlarmStore, useMedicineStore, useReminderStore } from '../store';
import './AIAssistant.css';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I am True Angel. I can help you set alarms, add medicine reminders, and more.' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [pendingClarification, setPendingClarification] = useState(null); 

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Stores Hooks
  const { addAlarm } = useAlarmStore();
  const { addMedicine } = useMedicineStore();
  const { addReminder } = useReminderStore();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Unified function to save the exact item once period (AM/PM) is locked in
  const executeSavedAction = (periodType, clarificationData) => {
    let { pendingHours, pendingMinutes, originalText } = clarificationData;
    
    // Convert to 24-hour military format securely
    if (periodType === 'pm' && pendingHours < 12) {
      pendingHours += 12;
    } else if (periodType === 'am' && pendingHours === 12) {
      pendingHours = 0;
    }

    const finalTimeStr = `${pendingHours.toString().padStart(2, '0')}:${pendingMinutes}`;
    const lowerText = originalText.toLowerCase();
    const uniqueId = Date.now().toString();
    
    // Save to the respective store based on keywords
    if (lowerText.includes('medicine') || lowerText.includes('dawa') || lowerText.includes('pill') || lowerText.includes('capsule') || lowerText.includes('sudha')) {
      addMedicine({
        id: uniqueId,
        name: 'Medicine',
        dosage: '1',
        dosageUnit: 'pill',
        frequency: 'daily',
        times: [finalTimeStr],
        takenToday: false
      });
    } else if (lowerText.includes('alarm') || lowerText.includes('wake') || lowerText.includes('baje')) {
      addAlarm({
        id: uniqueId,
        time: finalTimeStr,
        label: lowerText.includes('wake') ? 'Wake up' : 'Alarm',
        type: 'one-time',
        enabled: true
      });
    } else {
      addReminder({
        id: uniqueId,
        text: originalText,
        category: lowerText.includes('doctor') ? 'appointments' : 'tasks',
        priority: 'medium',
        date: 'Today',
        time: finalTimeStr,
        completed: false
      });
    }

    const successReply = `Alright! I have successfully scheduled your request for ${finalTimeStr}.`;

    // Clear state
    setPendingClarification(null);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 3, type: 'ai', text: successReply }]);
      voiceService.speak(successReply);
    }, 400);
  };

  const processInput = (text) => {
    if (!text.trim()) return;
    
    // 1. Add User Message
    const timestamp = Date.now();
    const newMsg = { id: timestamp, type: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    
    const lowerInput = text.toLowerCase().trim();

    // 2. Intercept text if there is an active pending clarification waiting for AM/PM
    if (pendingClarification) {
      if (lowerInput === 'am' || lowerInput === 'subah' || lowerInput === 'morning') {
        executeSavedAction('am', pendingClarification);
        return;
      } else if (lowerInput === 'pm' || lowerInput === 'raat' || lowerInput === 'night' || lowerInput === 'shaam') {
        executeSavedAction('pm', pendingClarification);
        return;
      }
    }
    
    // 3. Parse Normal Intent
    const intent = parseIntent(text);

    // 4. Handle Clarification Needed Interception
    if (intent.type === 'clarification_needed') {
      setPendingClarification(intent.data); 
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: intent.reply }]);
        voiceService.speak(intent.reply);
      }, 500);
      return; 
    }
    
    // 5. Normal Direct Action Execution (If AM/PM was already provided in initial string)
    const uniqueId = Date.now().toString();
    if (intent.type === 'medicine') {
      addMedicine({ 
        id: uniqueId, 
        name: intent.data?.name || 'Medicine',
        dosage: intent.data?.dosage || '1',
        dosageUnit: intent.data?.dosageUnit || 'pill',
        frequency: intent.data?.frequency || 'daily',
        times: intent.data?.times || ['08:00'],
        takenToday: false 
      });
    } else if (intent.type === 'alarm') {
      addAlarm({ 
        id: uniqueId, 
        time: intent.data?.time || '07:00',
        label: intent.data?.label || 'Alarm',
        type: intent.data?.type || 'one-time',
        enabled: true 
      });
    } else if (intent.type === 'reminder') {
      addReminder({ 
        id: uniqueId, 
        text: intent.data?.text || text,
        category: intent.data?.category || 'tasks',
        priority: intent.data?.priority || 'medium',
        date: intent.data?.date || 'Today',
        time: intent.data?.time || '12:00',
        completed: false 
      });
    }
    
    // 6. Success AI Reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 2, type: 'ai', text: intent.reply }]);
      voiceService.speak(intent.reply);
    }, 500);
  };

  const handleClarificationConfirm = (periodType) => {
    if (!pendingClarification) return;
    const userChoiceLabel = periodType === 'am' ? 'Morning (AM)' : 'Night (PM)';
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userChoiceLabel }]);
    executeSavedAction(periodType, pendingClarification);
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    processInput(input);
    setInput('');
  };

  // --- IN AIAssistant.jsx: REPLACE THE OLD toggleListening WITH THIS ---
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    if (!voiceService.isSupported()) {
      setError('Voice recognition is not supported or permission is denied.');
      setTimeout(() => setError(''), 4000);
      return;
    }

    setIsListening(true);
    setError('');

    // Calling updated robust structure smoothly
    recognitionRef.current = voiceService.startListening({
      lang: 'hi-IN', // Supports Hinglish inputs like "add medicine 2 beja sudha" perfectly
      onResult: (transcript) => {
        setIsListening(false);
        processInput(transcript); 
      },
      onInterim: (partial) => {
        // Optional: you can show live typing here if you want
        console.log("Live speaking:", partial);
      },
      onError: (err) => {
        setIsListening(false);
        console.error("Voice Error Details:", err);
        if (err !== 'no-speech') {
          setError('Could not process voice input. Please verify mic access configurations.');
          setTimeout(() => setError(''), 4000);
        }
      }
    });
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <div className="assistant-container"
     style={{
        paddingTop: '60px',     /* <-- Sabhi pages ki tarah unified perfect layout gap */
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '140px', /* Taaki text-input field aur bottom mic ke liye achhi space mile */
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
      }}
    >
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

      {/* AM/PM Selection Box Component */}
      {pendingClarification && (
        <div className="clarification-container" style={{ display: 'flex', gap: '10px', padding: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => handleClarificationConfirm('am')}
            className="clarification-btn clarification-btn-am"
            style={{ padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff' }}
          >
            ☀️ Subah (AM)
          </button>
          <button 
            onClick={() => handleClarificationConfirm('pm')}
            className="clarification-btn clarification-btn-pm"
            style={{ padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', border: '1px solid #ccc', backgroundColor: '#fff' }}
          >
            🌙 Raat (PM)
          </button>
        </div>
      )}

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