import { useAuth } from '../context/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Bienvenido, {user?.username}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;