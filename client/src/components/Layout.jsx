import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <header><Navbar /></header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
