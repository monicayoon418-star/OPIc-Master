export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-24 bg-toss-gray100 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-20 bg-toss-gray100 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        {[1,2,3].map(i => <div key={i} className="h-8 w-20 bg-toss-gray100 rounded-full animate-pulse" />)}
      </div>
      <div className="bg-white border border-toss-gray100 rounded-2xl overflow-hidden">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="p-5 border-b border-toss-gray100">
            <div className="h-5 w-3/4 bg-toss-gray100 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-toss-gray100 rounded-lg animate-pulse mb-3" />
            <div className="flex gap-3">
              <div className="h-3 w-16 bg-toss-gray100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-toss-gray100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
