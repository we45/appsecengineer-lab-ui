import { date } from 'quasar'
const defaultDateFormat = 'MMM Do, YYYY'
export function formatTime(timeStamp, format = 'h:mm A') {
  if (!timeStamp) return null
  return date.formatDate(timeStamp, format)
}

export function formatDate(value, format = defaultDateFormat) {
  if (date.isValid(value)) {
    return date.formatDate(value, format)
  } else if (Array.isArray(value)) {
    return value.map((ele) => formatDate(ele, format))
  } else if (is.object(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, formatDate(val, format)]))
  }
  return value
}
export function since(data) {
  if (!data) return null
  const timeStamp = Date.now()
  let diff = date.getDateDiff(timeStamp, data, 'seconds')
  if (diff < 60) {
    return `${diff} seconds ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'minutes')
  if (diff < 60) {
    return `${diff} minutes ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'hours')
  if (diff < 24) {
    return `${diff} hours ago`
  }
  diff = date.getDateDiff(timeStamp, data, 'days')
  if (diff == 1) {
    const time = formatTime(data)
    return `Yesterday at ${time}`
  } else if (diff < 7) {
    const time = formatTime(data)
    return `${diff} days ago at ${time}`
  }
  return `${formatDate(data)} at ${formatTime(data)}`
}

export function getTimePassedInPercentage(start_ttl, end_ttl) {
  const startTime = new Date(start_ttl * 1000)
  const endTime = new Date(end_ttl * 1000)

  const distance = endTime - startTime
  const timePassed = new Date() - startTime

  return Math.floor((timePassed / distance) * 100)
}

export function getTimeSpent(seconds) {
  if (!seconds) return '00h 00m'

  let minutes = Math.round(seconds / 60)
  let hours = 0

  if (minutes > 59) {
    hours = Math.round(minutes / 60)
    minutes = Math.round(minutes % 60)
  }

  minutes = minutes.toString().padStart(2, '0')

  return `${hours}h ${minutes}m`
}

export function getDateRangeOneYearAgo() {
  const currentDate = new Date()

  const lastDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1)

  const oneYearAgo = new Date(currentDate)
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1)
  oneYearAgo.setDate(1)
  const oneYearAgoString = oneYearAgo.toISOString().split('T')[0]
  const lastDateString = lastDayOfCurrentMonth.toISOString().split('T')[0]

  return [oneYearAgoString, lastDateString]
}

/**
 * Safely converts a date string to ISO 8601 format with noon UTC time to prevent date shifting issues
 * This addresses the JavaScript Date parsing quirks where strings without timezone information
 * are interpreted differently based on format (ISO vs non-ISO).
 *
 * @param {string} dateStr - The date string to convert
 * @returns {string} - ISO 8601 formatted date string with noon UTC time
 */
export function toSafeISOString(dateStr) {
  if (!dateStr) return null

  // First normalize to format that's consistently interpreted as local timezone
  const normalizedDate = dateStr.replace(/[-/]/g, '/')
  const localDate = new Date(normalizedDate)

  if (!date.isValid(localDate)) return null

  // Create UTC date string manually in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.SSSZ)
  // Setting time to 12:00:00 UTC ensures the date remains the same regardless of timezone
  const year = localDate.getFullYear()
  const month = String(localDate.getMonth() + 1).padStart(2, '0')
  const day = String(localDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}T12:00:00.000Z`
}
