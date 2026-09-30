import { useEffect, useState } from "react";

function EffectDemo() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    setMessage("Admin CMS loaded successfully!");
  }, []);

  return (
    <div>
      <h2>useEffect Demo</h2>
      <p>{message}</p>
    </div>
  );
}

export default EffectDemo;