export default function LoadingSpinner() {
  return (
    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
