'use client'
import { useState } from 'react'
import { Activity } from '../types'

interface AddActivityFormProps {
  onAddActivity: (activity: Omit<Activity, 'id'>) => void
  initialActivity?: Activity
  onCancel?: () => void
}

const pastelColors = [
  // Sunset palette from image
  '#E6E6FA', // soft periwinkle
  '#E0CFE6', // dusty lavender
  '#F4D9E4', // muted pink
  '#FFE4E4', // light pink
  '#FFF0F0', // softest pink
  
  // Additional complementary pastels
  '#F0E6FF', // soft violet
  '#FFE6F0', // baby pink
  '#FFE6E6', // peach pink
  '#FFF0E6', // soft peach
  '#FFFAE6', // cream yellow
  '#F0FFE6', // mint cream
  '#E6FFF0', // soft mint
  '#E6FFFF', // light cyan
  '#E6F0FF', // baby blue
  '#FFE6EB'  // rose pink
]

export default function AddActivityForm({ onAddActivity, initialActivity, onCancel }: AddActivityFormProps) {
  const [name, setName] = useState(initialActivity?.name || '')
  const [duration, setDuration] = useState(initialActivity?.duration.toString() || '')
  const [days, setDays] = useState<string[]>(initialActivity?.days || [])
  const [time, setTime] = useState(initialActivity?.time || '')
  const [color, setColor] = useState(initialActivity?.color || pastelColors[0])
  const [imageUrl, setImageUrl] = useState(initialActivity?.coverImage || '')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddActivity({
      name,
      duration: parseInt(duration),
      days,
      time,
      color,
      coverImage: imageUrl
    })
    
    // Only clear form if not editing (no initialActivity)
    if (!initialActivity) {
      setName('')
      setDuration('')
      setDays([])
      setTime('')
      setColor(pastelColors[0])
      setImageUrl('')
    }
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day: string) => {
    setDays(days.includes(day) 
      ? days.filter(d => d !== day)
      : [...days, day]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-mono text-gray-900">Add New Activity</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Days</label>
        <div className="mt-1 grid grid-cols-7 gap-2">
          {daysOfWeek.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-2 py-1 text-xs rounded ${
                days.includes(day)
                  ? 'bg-[#f7e9e9] border border-dashed border-black'
                  : 'bg-gray-100'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div className="grid grid-cols-5 gap-2 mt-1">
          {pastelColors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-8 h-8 rounded-full border ${
                color === colorOption ? 'border-black' : 'border-black border-dashed'
              } hover:scale-110 transition-transform`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#f7e9e9] file:text-gray-700
            hover:file:bg-[#f0dcdc]"
        />
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-2 px-4 border border-dashed border-black rounded-md shadow-sm text-sm font-medium text-gray-800 bg-[#f7e9e9] hover:bg-[#f0dcdc]"
        >
          {initialActivity ? 'Save Changes' : 'Add Activity'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-dashed border-black rounded-md shadow-sm text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}