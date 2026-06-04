export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="h-8 w-28 bg-toss-gray100 rounded-xl animate-pulse mb-8" />
      <div className="bg-white border border-toss-gray100 rounded-3xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-toss-gray100 animate-pulse" />
          <div>
            <div className="h-5 w-24 bg-toss-gray100 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-32 bg-toss-gray100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="h-14 bg-white border border-toss-gray100 rounded-2xl animate-pulse mb-3" />
      ))}
    </div>
  )
}
