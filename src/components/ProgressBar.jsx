export default function ProgressBar({ value }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label="Session progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
    >
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  )
}
