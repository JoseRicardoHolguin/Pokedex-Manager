import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import PokemonCard from '../components/PokemonCard';

function Dashboard() {
  const { user, logout } = useAuth();

  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar la colección al montar el componente
  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const res = await api.get('/pokemon/collection');
      setCollection(res.data);
    } catch (err) {
      console.error('Error al cargar la colección', err);
    }
  };

  const handleSearch = async (query) => {
    setSearchError('');
    setSearchResult(null);
    setLoading(true);

    try {
      const res = await api.get(`/pokemon/search/${query}`);
      setSearchResult(res.data);
    } catch (err) {
      setSearchError(err.response?.data?.error || 'Error al buscar el Pokémon');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (pokemon) => {
    try {
      await api.post('/pokemon/collection', {
        pokemon_id: pokemon.id,
        pokemon_name: pokemon.name,
        sprite_url: pokemon.sprite,
      });
      loadCollection();
    } catch (err) {
      console.error('Error al agregar a la colección', err);
    }
  };

  const handleRemove = async (item) => {
    try {
      await api.delete(`/pokemon/collection/${item.id}`);
      loadCollection();
    } catch (err) {
      console.error('Error al eliminar de la colección', err);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>PokéDex Manager</h1>
        <div>
          <span>Hola, {user?.username}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <section className="search-section">
        <h2>Buscar Pokémon</h2>
        <SearchBar onSearch={handleSearch} />

        {loading && <p>Buscando...</p>}
        {searchError && <p className="error">{searchError}</p>}

        {searchResult && (
          <PokemonCard
            pokemon={searchResult}
            onAction={handleAdd}
            actionLabel="Agregar a mi colección"
          />
        )}
      </section>

      <section className="collection-section">
        <h2>Mi colección ({collection.length})</h2>

        {collection.length === 0 ? (
          <p>Todavía no tienes Pokémon en tu colección. ¡Busca uno y agrégalo!</p>
        ) : (
          <div className="collection-grid">
            {collection.map((item) => (
              <PokemonCard
                key={item.id}
                pokemon={item}
                onAction={handleRemove}
                actionLabel="Eliminar"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;