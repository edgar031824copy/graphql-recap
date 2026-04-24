import Providers from './providers.tsx';
import NavBar from '../shared/components/NavBar/NavBar.tsx';
import AppRoutes from './routes.tsx';

export default function App() {
  return (
    <Providers>
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <AppRoutes />
      </main>
    </Providers>
  );
}
