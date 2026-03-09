import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import MoviesList from './components/movies/MoviesList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <BannerSlider />
      <main className="container mx-auto p-4">
        <MoviesList />
      </main>
    </div>
  );
};

export default App;