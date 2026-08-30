export default function CollaborationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-[#25262b] rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">
          Real-Time Collaborative Algorithm Sessions
        </h1>

        <p className="text-lg mb-8">
          Learn algorithms together with your friends and classmates.
          Create rooms, share links, discuss steps, and watch synchronized visualizations.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg">
            Create Session
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
            Join Session
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">
            Planned Features
          </h2>

          <ul className="list-disc ml-6 space-y-2">
            <li>Live synchronized algorithm playback</li>
            <li>Host controls for play, pause, and navigation</li>
            <li>Real-time chat and comments</li>
            <li>Shareable room links</li>
            <li>Collaborative learning history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}