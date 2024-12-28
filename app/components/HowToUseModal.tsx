interface HowToUseModalProps {
  onClose: () => void
}

export default function HowToUseModal({ onClose }: HowToUseModalProps) {
  return (
    <div className="fixed inset-0" style={{ zIndex: 99999 }}>
      {/* Full screen overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-mono">How to Use</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Adding Activities</h3>
              <p className="mb-2">Fill in the activity details in the form:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name your activity</li>
                <li>Set the duration in minutes</li>
                <li>Select the days it occurs</li>
                <li>Choose a start time</li>
                <li>Pick a color (optional)</li>
                <li>Add a cover image (optional)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Drag and Drop</h3>
              <p>Drag activities from the bank to schedule them on specific days.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Managing Activities</h3>
              <p>Click on any activity to edit or delete it.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 