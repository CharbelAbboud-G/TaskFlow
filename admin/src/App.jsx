import UserCard from "./components/UserCard";
import TaskCounter from "./components/TaskCounter";
import EffectDemo from "./components/EffectDemo";

function App() {
  return (
    <main>
      <h1>TaskFlow Admin CMS</h1>
      <p>Week 2 - React Fundamentals</p>

      <UserCard name="Charbel" role="Administrator" />
      <UserCard name="Test User" role="User" />

      <TaskCounter />

      <EffectDemo />
    </main>
  );
}

export default App;