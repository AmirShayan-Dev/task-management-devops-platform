
import { useEffect, useState } from "react";
import logo from "./assets/beni.jpeg";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("https://www.coddit.ir/api/tasks/")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div>
      <div
  style={{
    textAlign: "center",
    margin: "20px auto",
  }}
>
  <div
    style={{
      marginBottom: "12px",
      fontSize: "20px",
      fontWeight: "600",
    }}
  >
    chetorii rifikh
  </div>

  <img
    src={logo}
    alt="Task Management Logo"
    style={{
      width: "100%",
      maxWidth: "300px",
      height: "auto",
      display: "block",
      margin: "0 auto",
      borderRadius: "16px",
      objectFit: "cover",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    }}
  />
</div>
      {tasks.map(task => (
        <div key={task.id}>
          {task.title} - {task.status}
        </div>
      ))}
    </div>
  );
}

export default App;
