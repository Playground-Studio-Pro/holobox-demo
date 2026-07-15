import { useState } from 'react'
import Welcome from './screens/Welcome.jsx'
import Menu from './screens/Menu.jsx'
import Viewer from './screens/Viewer.jsx'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  function handleSelectUseCase(uc) {
    setSelectedUseCase(uc)
    setScreen('viewer')
  }

  return (
    <div className="app">
      {screen === 'welcome' && (
        <Welcome onEnter={() => setScreen('menu')} />
      )}
      {screen === 'menu' && (
        <Menu
          onBack={() => setScreen('welcome')}
          onSelect={handleSelectUseCase}
        />
      )}
      {screen === 'viewer' && selectedUseCase && (
        <Viewer
          useCase={selectedUseCase}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  )
}
