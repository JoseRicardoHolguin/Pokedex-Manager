function PokemonCard({ pokemon, onAction, actionLabel, onCardClick }) {
  const types = Array.isArray(pokemon.types)
    ? pokemon.types
    : pokemon.types
    ? JSON.parse(pokemon.types)
    : [];

  return (
    <div
      className={`pokemon-card ${types[0] ? `type-bg-${types[0]}` : ''}`}
      onClick={() => onCardClick?.(pokemon)}
      style={{ cursor: onCardClick ? 'pointer' : 'default' }}
    >
      <img src={pokemon.sprite || pokemon.sprite_url} alt={pokemon.name || pokemon.pokemon_name} />
      <h3>{pokemon.nickname || pokemon.name || pokemon.pokemon_name}</h3>

      {types.length > 0 && (
        <div className="types">
          {types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      )}

      {pokemon.stats && (
        <div className="stats">
          {pokemon.stats.map((stat) => (
            <span key={stat.name}>
              {stat.name}: {stat.value}
            </span>
          ))}
        </div>
      )}

      {onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction(pokemon);
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default PokemonCard;