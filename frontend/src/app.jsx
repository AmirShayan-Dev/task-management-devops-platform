
import { useEffect, useState } from "react";
import logo from "./assets/beni.jpeg";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      {tasks.map(task => (
        <div key={task.id}>
          {task.title} - {task.status}
          <div>beni si here, wassup with it?!</div>
          <img src={logo} alt="Task Management Logo" />
        </div>
      ))}
    </div>
  );
}

export default App;