import { Outlet } from 'remix';

export default function Assets() {
  return (
    <main className='container mt-10'>
      <h1 className='text-2xl font-semibold mb-5'>Assets</h1>
      <Outlet />
    </main>
  );
}
