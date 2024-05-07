import { useEffect, useState } from "react";
import "./index.css";
import { Button } from "./components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/ui/card";

function App() {
  const [count, setCount] = useState(0);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      const res = await fetch("/api/total-spent");
      setSpent(await res.json());
    };
    fetchTotal();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        <Button
          className="p-4 bg-gray-300"
          onClick={() => setCount((count) => count + 1)}
        >
          Up
        </Button>
        <Button onClick={() => setCount((count) => count - 1)}>Down</Button>
        <p>{count}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total spend</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The total amount you have spent {spent}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}

export default App;
