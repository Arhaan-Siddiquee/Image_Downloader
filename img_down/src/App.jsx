import { useState } from 'react';

function App() {
  const [imageUrls, setImageUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');
    setDownloadLink('');

    try {
      const response = await fetch('https://golang-imagedown-api.onrender.com/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageURLs: imageUrls.split('\n').filter(url => url.trim() !== ''),
          destDir: 'downloaded_images'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageType('success');
        setMessage('Images downloaded successfully!');
        setDownloadLink(data.downloadLink || '');
      } else {
        setMessageType('error');
        setMessage(data.error || 'Failed to download images');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Image Downloader</h1>
            <p className="mt-2 text-gray-600">Download multiple images at once using our API</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs (one per line)
              </label>
              <textarea
                id="imageUrls"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder="https://example.com/image1.jpg
https://example.com/image2.png"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Download Images'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-md ${messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
              {downloadLink && (
                <div className="mt-2">
                  <a 
                    href={downloadLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Download your images here
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-800">How to use</h2>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Enter one image URL per line</li>
              <li>Supported formats: JPG, PNG, GIF, WEBP</li>
              <li>API handles Next.js/Vercel optimized images automatically</li>
              <li>Downloads will be zipped and available for download</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;