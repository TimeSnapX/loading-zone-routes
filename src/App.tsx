import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useZones } from './hooks/useZones'
import { HomePage } from './pages/HomePage'
import { ZoneDetailPage } from './pages/ZoneDetailPage'
import { ZoneFormPage } from './pages/ZoneFormPage'

export default function App() {
  const {
    zones,
    notes,
    getZone,
    saveNote,
    addCustomZone,
    updateZone,
    deleteCustomZone,
    pins,
    setPin,
    clearPin,
    importPins,
    getBundledZone,
  } = useZones()
  const nameOf = (id: string) => getZone(id)?.name ?? id

  return (
    <HashRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar__brand">
            <p className="topbar__eyebrow">TimeSnap · BevChain SEQ</p>
            <h1 className="topbar__title">Liquorland Docks</h1>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<HomePage zones={zones} pins={pins} nameOf={nameOf} importPins={importPins} />} />
          <Route
            path="/zone/:id"
            element={
              <ZoneDetailPage
                getZone={getZone}
                notes={notes}
                saveNote={saveNote}
                updateZone={updateZone}
                deleteCustomZone={deleteCustomZone}
                pins={pins}
                setPin={setPin}
                clearPin={clearPin}
                importPins={importPins}
                getBundledZone={getBundledZone}
                nameOf={nameOf}
              />
            }
          />
          <Route
            path="/add"
            element={
              <ZoneFormPage
                getZone={getBundledZone}
                addCustomZone={addCustomZone}
                updateZone={updateZone}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ZoneFormPage
                getZone={getBundledZone}
                addCustomZone={addCustomZone}
                updateZone={updateZone}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
