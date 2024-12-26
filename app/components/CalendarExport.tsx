import { Activity } from '../types'

interface CalendarExportProps {
  schedule: { [key: string]: Activity[] }
}

export default function CalendarExport({ schedule }: CalendarExportProps) {
  const generateICSContent = () => {
    const events = Object.entries(schedule).flatMap(([day, activities]) =>
      activities.map(activity => {
        // Convert day and time to full ISO date
        const date = getNextDayDate(day)
        const [hours, minutes] = activity.time.split(':')
        date.setHours(parseInt(hours), parseInt(minutes), 0)
        
        const endDate = new Date(date)
        endDate.setMinutes(date.getMinutes() + activity.duration)

        return `BEGIN:VEVENT
DTSTART:${formatDate(date)}
DTEND:${formatDate(endDate)}
SUMMARY:${activity.name}
DESCRIPTION:Duration: ${activity.duration} minutes
END:VEVENT`
      })
    )

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedule Builder//EN
${events.join('\n')}
END:VCALENDAR`
  }

  const getNextDayDate = (day: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const targetDay = days.indexOf(day)
    const currentDay = today.getDay()
    const daysUntilTarget = (targetDay + 7 - currentDay) % 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysUntilTarget)
    return targetDate
  }

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const downloadSchedule = () => {
    const icsContent = generateICSContent()
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'schedule.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={downloadSchedule}
      className="flex items-center justify-center px-4 py-2 bg-[#f7e9e9] text-gray-800 rounded-md hover:bg-[#f0dcdc] transition-colors border border-dashed border-black"
    >
      Export Schedule
    </button>
  )
} 