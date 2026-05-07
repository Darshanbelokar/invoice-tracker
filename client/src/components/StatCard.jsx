export default function StatCard({ title, value, change, changeType, icon: Icon, color, index }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900" style={{fontFamily:'Syne,sans-serif'}}>{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${
              changeType === 'up' ? 'text-emerald-600' :
              changeType === 'down' ? 'text-red-600' :
              'text-slate-500'
            }`}>
              {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${
            color === 'indigo' ? 'bg-indigo-50' :
            color === 'emerald' ? 'bg-emerald-50' :
            color === 'amber' ? 'bg-amber-50' :
            color === 'red' ? 'bg-red-50' :
            'bg-slate-50'
          }`}>
            <Icon className={`w-5 h-5 ${
              color === 'indigo' ? 'text-indigo-600' :
              color === 'emerald' ? 'text-emerald-600' :
              color === 'amber' ? 'text-amber-600' :
              color === 'red' ? 'text-red-600' :
              'text-slate-600'
            }`} />
          </div>
        )}
      </div>
    </div>
  );
}
