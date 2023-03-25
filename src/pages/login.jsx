import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // Check if the username and password are correct
    if (username === 'puneetkathar1' && password === 'pass') {
      // Set the cookie to indicate that the user is authenticated
      document.cookie = 'authenticated=true'

      // Redirect to the protected page
      router.push('/')
    } else {
      setError('Incorrect username or password')
    }
  }

  const styles = `
  form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 500px;
}

fieldset {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

legend {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="number"] {
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

button[type="submit"] {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
}

button[type="submit"]:hover {
  background-color: #3e8e41;
}
  `

  return (
    <div>
      <style>{styles}</style>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  )
}
