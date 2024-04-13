import { useState } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState('')
  const [original, setOriginal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage('')
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setOriginal(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const fetchApi = async () => {
    setLoading(true)
    const response = await fetch('http://localhost:5000/equalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photo: original.split('base64,')[1],
      }),

    })
    const data = await response.json()
    setImage(`data:image/jpeg;base64,${data}`)
    setLoading(false)
  }

  const renderImage = () => {
    if (original) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%' }}>
          <img
              src={original}
              alt="imagem original"
              style={{ width: "40%", height: "auto", maxWidth: "40%", maxHeight: "40%" }}
          />
          <button onClick={fetchApi}>{'Processar >'}</button>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            image && (
              <img
                src={image}
                alt="Imagem Equalizada"
                style={{ width: "40%", height: "auto", maxWidth: "40%", maxHeight: "40%" }}
              />
            )
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '80vh', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: 20 }}>
        <h1>Keka</h1>
        <hr />
        <h3>Clique para escolher{original ? ' outra ' : ' uma '}foto:</h3>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: 20 }}>
          <label htmlFor="files" className='button'>Escolha {original ? ' outra ' : ' uma '} foto</label>
          <input id="files" style={{ visibility: 'hidden' }} type="file" onChange={handleFileChange} />
        </div>
      </div>

      <hr />

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%' }}>
        {renderImage()}
      </div>
    </div>
  )
}

export default App
