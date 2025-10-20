
import React, { useState } from 'react';
import QRCode from 'qrcode';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { QrCodeIcon } from './components/icons/QrCodeIcon';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleGenerateQRCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setQrCodeDataUrl('');

    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com/menu).');
      return;
    }
    
    setIsLoading(true);

    try {
      // FIX: The 'quality' option is only valid for 'image/jpeg' or 'image/webp' types.
      // It was removed to fix the QRCode.toDataURL overload error. This also resolves
      // the subsequent type inference error for `setQrCodeDataUrl`.
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 320,
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <QrCodeIcon className="h-10 w-10 text-indigo-400" />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Static QR Menu
            </h1>
          </div>
          <p className="mt-4 text-lg text-slate-300">
            Generate a QR code for your menu that never needs to change.
          </p>
        </header>

        <main className="bg-slate-800/60 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
          <form onSubmit={handleGenerateQRCode} className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-1">
                Your Menu URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-restaurant.com/menu"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md text-center text-sm">
              {error}
            </div>
          )}

          {qrCodeDataUrl && (
            <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col items-center animate-fade-in">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Your QR Code is Ready!</h2>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-64 h-64" />
              </div>
              <a
                href={qrCodeDataUrl}
                download="restaurant-menu-qrcode.png"
                className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 transition-all duration-300 ease-in-out"
              >
                <DownloadIcon className="w-5 h-5" />
                Download PNG
              </a>
            </div>
          )}
        </main>
        
        {/* FIX: Replaced 'class' with 'className' as is required in JSX. */}
        <footer className="text-center mt-8">
            <p className="text-sm text-slate-500">A permanent QR solution for your dynamic menu.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
