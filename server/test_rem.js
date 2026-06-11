fetch("http://localhost:3001/api/reminders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Test Reminder",
    category: "task",
    priority: "high",
    date: "2023-12-01",
    completed: false
  })
}).then(r => r.json()).then(console.log).catch(console.error);
