fetch("http://localhost:3001/api/reminders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Toggle Test",
    category: "task"
  })
})
.then(r => r.json())
.then(data => {
  console.log("Created:", data.id, "Completed:", data.completed);
  return fetch(`http://localhost:3001/api/reminders/${data.id}/toggle`, { method: "PUT" });
})
.then(r => r.json())
.then(data => {
  console.log("Toggled completed:", data.completed);
})
.catch(console.error);
