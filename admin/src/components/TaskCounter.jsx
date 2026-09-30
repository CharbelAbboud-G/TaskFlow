import { useState } from "react";

function TaskCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Task Counter</h2>

      <p>Number of tasks: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Add Task
      </button>

      <button onClick={() => setCount(count - 1)}>
        Remove Task
      </button>
    </div>
  );
}

export default TaskCounter;