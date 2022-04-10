import { Outlet } from 'remix';

export default function Assets() {
  return (
    <main className='container mt-10'>
      <Outlet />
    </main>
  );
}
