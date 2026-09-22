function PokemonCard({ pokemon, onAction, actionLabel }) {
  return (
    <div className="pokemon-card">
      <img src={pokemon.sprite || pokemon.sprite_url} alt={pokemon.name || pokemon.pokemon_name} />
      <h3>{pokemon.nickname || pokemon.name || pokemon.pokemon_name}</h3>

      {pokemon.types && (
        <div className="types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
      )}

      {onAction && (
        <button onClick={() => onAction(pokemon)}>{actionLabel}</button>
      )}
    </div>
  );
}

export default PokemonCard;