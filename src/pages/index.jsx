import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Protected() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if the authenticated cookie is set
    const cookies = document.cookie.split('; ')
    const authenticatedCookie = cookies.find((cookie) =>
      cookie.startsWith('authenticated='),
    )

    if (authenticatedCookie) {
      setAuthenticated(true)
    } else {
      // Redirect to the login page if the cookie is not set
      router.push('/login')
    }
  }, [])

  const [metalMarkup, setMetalMarkup] = useState({})
  const [typeMarkup, setTypeMarkup] = useState({})
  const [weightMarkup, setWeightMarkup] = useState({})
  const [brandMarkup, setBrandMarkup] = useState({})

  useEffect(() => {
    async function fetchMarkup() {
      const res = await fetch('/api/markup')
      const markup = await res.json()
      setMetalMarkup(markup.MetalMarkup)
      setTypeMarkup(markup.TypeMarkup)
      setWeightMarkup(markup.WeightMarkup)
      setBrandMarkup(markup.BrandMarkup)
    }

    fetchMarkup()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      MetalMarkup: metalMarkup,
      TypeMarkup: typeMarkup,
      WeightMarkup: weightMarkup,
      BrandMarkup: brandMarkup,
    }

    const res = await fetch('/api/markup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      const { message } = await res.json()
      alert(message)
    }
  }

  const handleLogout = () => {
    // Remove the authenticated cookie
    document.cookie =
      'authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

    // Redirect to the login page
    router.push('/login')
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
    <>
      <style>{styles}</style>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Metal Markup</legend>
          {Object.entries(metalMarkup).map(([metal, markup]) => (
            <div key={metal}>
              <label htmlFor={`metal-${metal}`}>{metal}</label>
              <input
                id={`metal-${metal}`}
                type="number"
                min="-100"
                step="1"
                value={markup}
                onChange={(e) =>
                  setMetalMarkup((prev) => ({
                    ...prev,
                    [metal]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Type Markup</legend>
          {Object.entries(typeMarkup).map(([type, markup]) => (
            <div key={type}>
              <label htmlFor={`type-${type}`}>{type}</label>
              <input
                id={`type-${type}`}
                type="number"
                min="-100"
                step="1"
                value={markup}
                onChange={(e) =>
                  setTypeMarkup((prev) => ({
                    ...prev,
                    [type]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Weight Markup</legend>
          {Object.entries(weightMarkup).map(([weight, markup]) => (
            <div key={weight}>
              <label htmlFor={`weight-${weight}`}>{weight}</label>
              <input
                id={`weight-${weight}`}
                type="number"
                min="-100"
                step="1"
                value={markup}
                onChange={(e) =>
                  setWeightMarkup((prev) => ({
                    ...prev,
                    [weight]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>Brand Markup</legend>
          {Object.entries(brandMarkup).map(([brand, markup]) => (
            <div key={brand}>
              <label htmlFor={`brand-${brand}`}>{brand}</label>
              <input
                id={`brand-${brand}`}
                type="number"
                min="-100"
                step="1"
                value={markup}
                onChange={(e) =>
                  setBrandMarkup((prev) => ({
                    ...prev,
                    [brand]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}
        </fieldset>
        <button
          style={{
            margin: '1rem',
            padding: '1rem',
            color: 'white',
            borderRadius: '20rem',
            backgroundColor: 'red',
          }}
          onClick={handleLogout}
        >
          Logout
        </button>

        <button type="submit">Save</button>
      </form>
    </>
  )
}
