// Utility to parse natural language commands into actionable intents

export function parseIntent(text) {
  const lowerText = text.toLowerCase();
  
  // 1. Alarm intent ("Wake me up at 5 AM", "Set an alarm for 7:30")
  const alarmMatch = lowerText.match(/(?:wake me up at|set alarm for|set an alarm for)\s+(.*?)(?:\s|$)/);
  if (alarmMatch || lowerText.includes('wake me') || lowerText.includes('alarm')) {
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    
    let timeStr = '07:00'; // fallback
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] || '00';
      const period = timeMatch[3];
      
      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
      
      timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    return {
      type: 'alarm',
      data: {
        time: timeStr,
        label: lowerText.includes('wake') ? 'Wake up' : 'Alarm',
        type: 'one-time'
      },
      reply: `I've set your alarm for ${timeStr}.`
    };
  }
  
  // 2. Medicine intent ("Remind me to take medicine at 8 PM")
  if (lowerText.includes('medicine') || lowerText.includes('pill')) {
    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    let timeStr = '20:00'; // fallback 8 PM
    
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2] || '00';
      const period = timeMatch[3];
      
      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;
      
      timeStr = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    return {
      type: 'medicine',
      data: {
        name: 'Medicine',
        dosage: '1',
        dosageUnit: 'pill',
        frequency: 'daily',
        times: [timeStr]
      },
      reply: `I'll remind you to take your medicine at ${timeStr}.`
    };
  }
  
  // 3. Task/Appointment Reminder intent ("Remind me to call doctor tomorrow")
  if (lowerText.includes('remind me to') || lowerText.includes('schedule')) {
    let taskText = lowerText.replace(/remind me to/g, '').replace(/schedule/g, '').trim();
    let date = 'Today';
    
    if (taskText.includes('tomorrow')) {
      date = 'Tomorrow';
      taskText = taskText.replace('tomorrow', '').trim();
    }
    
    const category = taskText.includes('doctor') || taskText.includes('appointment') ? 'appointments' : 'tasks';
    
    return {
      type: 'reminder',
      data: {
        text: taskText.charAt(0).toUpperCase() + taskText.slice(1),
        category,
        priority: 'medium',
        date: date
      },
      reply: `I've added "${taskText}" to your reminders for ${date.toLowerCase()}.`
    };
  }

  // 4. Default Greeting / Unknown
  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return { type: 'chat', reply: "Hello! I'm here to help you manage your health and schedule." };
  }

  return { type: 'chat', reply: "I've noted that down. You can ask me to set alarms or remind you about medicines." };
}
