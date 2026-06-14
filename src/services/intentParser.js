// Utility to parse natural language commands into actionable intents
export function parseIntent(text) {
  const lowerText = text.toLowerCase();
  
  // ==========================================
  // STEP 1: TIME EXTRACTION
  // ==========================================
  const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje)?/);

  let hours = null;
  let minutes = '00';
  let period = '';

  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = timeMatch[2] || '00';
    period = timeMatch[3] || '';
  }

  // ==========================================
  // STEP 2: CLARIFICATION LOGIC (Hinglish + English Support)
  // ==========================================
  let isTimeSet = false;
  let needsClarification = false;

  if (hours !== null) {
    const containsNight = lowerText.includes('raat') || lowerText.includes('shyam') || lowerText.includes('evening') || lowerText.includes('pm') || lowerText.includes('night');
    const containsMorning = lowerText.includes('subah') || lowerText.includes('morning') || lowerText.includes('am') || lowerText.includes('dopehar');

    if (containsNight) {
      if (hours < 12) hours += 12;
      isTimeSet = true;
    } else if (containsMorning || period === 'am') {
      if (hours === 12) hours = 0;
      isTimeSet = true;
    } else {
      // Missing AM/PM context -> Trigger Confirmation
      needsClarification = true;
    }

    if (needsClarification) {
      return {
        type: 'clarification_needed',
        data: { 
          pendingHours: hours, 
          pendingMinutes: minutes,
          originalText: text 
        },
        reply: `You mentioned ${hours}:${minutes}. Do you want to set it for Morning (AM) or Night (PM)?`
      };
    }
  }

  // Final structured military time string
  const timeStr = hours !== null ? `${hours.toString().padStart(2, '0')}:${minutes}` : '07:00';

  // ==========================================
  // STEP 3: INTENT CATEGORIZATION & ENGLISH REPLIES
  // ==========================================

  // A. Medicine Intent
  if (lowerText.includes('medicine') || lowerText.includes('pill') || lowerText.includes('dawa') || lowerText.includes('capsule')) {
    return {
      type: 'medicine',
      data: {
        name: 'Medicine',
        dosage: '1',
        dosageUnit: 'pill',
        frequency: 'daily',
        times: [timeStr]
      },
      reply: `I have successfully added your medicine reminder at ${timeStr}.`
    };
  }
  
  // B. Alarm Intent
  if (lowerText.includes('alarm') || lowerText.includes('wake') || lowerText.includes('baje')) {
    return {
      type: 'alarm',
      data: {
        time: timeStr,
        label: lowerText.includes('wake') ? 'Wake up' : 'Alarm',
        type: 'one-time'
      },
      reply: `I have successfully set your alarm for ${timeStr}.`
    };
  }
  
  // C. General Reminder Intent
  if (lowerText.includes('remind') || lowerText.includes('schedule') || lowerText.includes('reminder') || lowerText.includes('call') || lowerText.includes('task')) {
    let taskText = lowerText.replace(/remind me to/g, '').replace(/schedule/g, '').replace(/reminder/g, '').replace(/add/g, '').trim();
    let date = 'Today';
    
    if (taskText.includes('tomorrow')) {
      date = 'Tomorrow';
      taskText = taskText.replace('tomorrow', '').trim();
    }
    
    const category = taskText.includes('doctor') || taskText.includes('appointment') ? 'appointments' : 'tasks';
    
    return {
      type: 'reminder',
      data: {
        text: text, // Keeps full user description
        category,
        priority: 'medium',
        date: date,
        time: timeStr
      },
      reply: `I have successfully added your reminder: "${text}" for ${date.toLowerCase()} at ${timeStr}.`
    };
  }

  // D. Default Greetings
  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return { type: 'chat', reply: "Hello! I am ready to help you manage your health and schedule." };
  }

  return { type: 'chat', reply: "I have noted that down. You can ask me to set alarms or remind you about medicines." };
}