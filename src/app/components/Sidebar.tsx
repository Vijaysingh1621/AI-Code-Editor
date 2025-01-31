export default function Sidebar() {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold">Project Files</h2>
        <ul className="mt-4 space-y-2">
          <li className="p-2 bg-gray-700 rounded">index.js</li>
          <li className="p-2 bg-gray-700 rounded">app.js</li>
        </ul>
      </div>
    );
  }
  