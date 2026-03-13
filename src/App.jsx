import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Detail from './pages/Detail';
import GenreList from './pages/GenreList';
import SearchResults from './pages/SearchResults';
import Favorites from './pages/Favorites';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        {headerVisible && <Header onMenuClick={toggleSidebar} />}
        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/detail/:type/:id" element={<Detail onHeaderVisibilityChange={setHeaderVisible} />} />
          <Route path="/genres/:type/:genreId" element={<GenreList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;