import React, { useState } from 'react';

interface HowToUseModalProps {
  onClose: () => void
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dvrswdujc/image/upload/v1735362707';

export default function HowToUseModal({ onClose }: HowToUseModalProps) {
  const [isPlaying, setIsPlaying] = useState({
    adding: false,
    dragging: false,
    editing: false
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: 99999 }}>
      {/* Modal container - clicking this closes the modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <div 
          className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-mono">How to Use</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Adding Activities</h3>
              <p>Use the form to add new activities to your activity bank.</p>
              <img 
                src={`${CLOUDINARY_BASE}/adding_activities_wk771x.gif`}
                alt="Adding activities demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Drag and Drop</h3>
              <p>Drag activities from the bank to schedule them on specific days.</p>
              <img 
                src={`https://res.cloudinary.com/dvrswdujc/image/upload/v1735362707/drag_and_drop_at2kav.gif`}
                alt="Drag and drop demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Managing Activities</h3>
              <p>Click on any activity to edit or delete it.</p>
              <img 
                src={`https://res.cloudinary.com/dvrswdujc/image/upload/v1735362706/edit_activities_p42qki.gif`}
                alt="Edit activities demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Saving Your Schedule</h3>
              <p>Your schedule is automatically saved as you make changes.</p>
              <img 
                src={`https://res.cloudinary.com/dvrswdujc/image/upload/v1735362706/saving_schedule_mbezj9.gif`}
                alt="Saving schedule demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Loading Schedules</h3>
              <p>Load your previously saved schedules from your profile.</p>
              <img 
                src={`https://res.cloudinary.com/dvrswdujc/image/upload/v1735362706/loading_schedule_trornc.gif`}
                alt="Loading schedule demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Exporting Your Schedule</h3>
              <p>Export your schedule to your calendar application.</p>
              <img 
                src={`https://res.cloudinary.com/dvrswdujc/image/upload/v1735362706/exporting_schedule_apuplp.gif`}
                alt="Exporting schedule demonstration"
                className="mt-4 rounded-lg shadow-sm w-full"
              />
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .gif-pause {
            animation-play-state: paused;
          }
          .gif-pause:hover {
            animation-play-state: running;
          }
        }
      `}</style>
    </div>
  )
} 