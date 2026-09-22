function PokemonDetailModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src={pokemon.sprite} alt={pokemon.name} className="modal-sprite" />
        <h2>{pokemon.name}</h2>

        <div className="types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>

        <div className="modal-info">
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
        </div>

        <div className="modal-stats">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="stat-row">
              <span className="stat-name">{stat.name}</span>
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${Math.min(stat.value, 150) / 1.5}%` }}
                ></div>
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailModal;