export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-white mb-3">Unsubscribe</h1>
          <p className="text-slate-400 mb-6">
            You've been removed from our outreach list. You will not receive further emails from energydirectory.ca.
          </p>
          <p className="text-slate-500 text-sm mb-6">
            If you have an active listing on Energy Directory, your account and listing remain active. 
            You can manage your listing preferences from your dashboard.
          </p>
          <a
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Visit Energy Directory
          </a>
        </div>
        <p className="text-slate-600 text-xs mt-6">
          energydirectory.ca — Canada's Energy Vendor Directory
        </p>
      </div>
    </div>
  );
}
