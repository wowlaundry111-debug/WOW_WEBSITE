import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './Redux/store';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Toaster } from 'react-hot-toast';

function SkeletonFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-50">
      <div className="w-full max-w-4xl p-5">
        <Skeleton height={50} width="40%" className="mb-5" />
        <Skeleton height={30} width="60%" className="mb-3" />
        <Skeleton height={20} width="80%" className="mb-3" />
        <Skeleton height={20} width="70%" className="mb-3" />
        <Skeleton height={400} className="mt-5" />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <Suspense fallback={<SkeletonFallback />}>
        <App />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </Suspense>
    </StrictMode>
  </Provider>
);
