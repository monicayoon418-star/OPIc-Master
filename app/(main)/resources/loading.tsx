export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-9 w-28 bg-toss-gray100 rounded-xl animate-pulse mb-2" />
        <div className="h-5 w-40 bg-toss-gray100 rounded-lg animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white border border-toss-gray100 rounded-2xl overflow-hidden">
            <div className="aspect-video bg-toss-gray100 animate-pulse" />
            <div className="p-4">
              <div className="h-5 w-4/5 bg-toss-gray100 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-3/5 bg-toss-gray100 rounded-lg animate-pulse mb-3" />
              <div className="flex gap-1.5">
                <div className="h-5 w-12 bg-toss-gray100 rounded-full animate-pulse" />
                <div className="h-5 w-14 bg-toss-gray100 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
