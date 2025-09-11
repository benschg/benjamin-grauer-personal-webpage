import './App.css'
import Header from './components/common/Header'
import Hero from './components/home/Hero'
import MainSections from './components/home/MainSections'
import Footer from './components/common/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <MainSections />
      <Footer />
    </div>
  )
}

export default App
