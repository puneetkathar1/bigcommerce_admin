import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the username and password are correct
    if (username === "puneetkathar1" && password === "pass") {
      // Set the cookie to indicate that the user is authenticated
      document.cookie = "authenticated=true";

      // Redirect to the protected page
      router.push("/");
    } else {
      setError("Incorrect username or password");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
}
