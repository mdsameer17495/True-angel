fetch("http://localhost:3001/api/reminders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Delete Test",
    category: "task"
  })
})
.then(r => r.json())
.then(data => {
  console.log("Created:", data.id);
  return fetch(`http://localhost:3001/api/reminders/${data.id}`, { method: "DELETE" });
})
.then(r => console.log("Delete status:", r.status))
.catch(console.error);
