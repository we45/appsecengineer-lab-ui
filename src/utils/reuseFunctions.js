import { Buffer } from 'buffer'
import { Cookies, exportFile, LocalStorage } from 'quasar'

const months = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' }

export const dateFormatReadable = (dateFormate) => {
  const splitedData = dateFormate.split('-')
  const year = parseInt(splitedData[0])
  const month = months[parseInt(splitedData[1])]
  const day = parseInt(splitedData[2])
  let result = ''
  if (day) {
    result = `${day} ${month} ${year}` // 1 Jan 2020
  } else {
    result = `${month} ${year}` // Jan 2020
  }
  return result
}

export const fullDateTimeUTC = (dateTimeString) => {
  const date = new Date(dateTimeString)

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  return new Intl.DateTimeFormat('en-US', options).format(date) // Jan 1, 2020, 12:00 AM
}

export const timeUntilTheEvent = (eventDateString) => {
  const eventDate = new Date(eventDateString)
  const currentDate = new Date()

  // Check if the event date is in the past
  if (eventDate < currentDate) {
    return 'undefined'
  }

  // Calculate the time difference in milliseconds
  const timeDiff = eventDate - currentDate

  // Calculate the number of days, hours, and minutes
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60)

  let formattedString = ''

  // Add days to the formatted string
  if (days > 0) {
    formattedString += `${days} ${days === 1 ? 'day' : 'days'}`
  }

  // Add hours to the formatted string
  if (hours > 0) {
    if (formattedString !== '') {
      formattedString += ' '
    }
    formattedString += `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  // Add minutes to the formatted string
  if (minutes > 0) {
    if (formattedString !== '') {
      formattedString += ' '
    }
    formattedString += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  }

  return formattedString.trim() // 1 day 2 hours 3 minutes
}

export const dateToEpTime = (date) => {
  return Date.parse(new Date(date))
}

export const readableDateNow = () => {
  const now = new Date().toLocaleDateString()
  const splitedData = now.split('/')
  const [day, month, year] = [parseInt(splitedData[0]), months[parseInt(splitedData[1])], parseInt(splitedData[2])]
  return `${day} ${month} ${year}` // 1 Jan 2020
}
export const DateComparison = (From, To) => {
  const x = new Date(From)
  const y = new Date(To)
  return x <= y
}
export const timeSince = (date) => {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 1) {
    return 'just now'
  }

  const interval = intervals.find((i) => i.seconds <= seconds)
  const count = Math.floor(seconds / (interval?.seconds ?? 1))

  return `${count} ${interval?.label ?? 'second'}${count !== 1 ? 's' : ''} ago`
}

export const timeSinceFromEpoch = (epoch) => {
  const intervals = [
    { label: 'more than year', seconds: 1112231536000 },
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ]
  const myDate = new Date(epoch)
  const seconds = Math.floor((Date.now() - myDate.getTime()) / 1000)

  if (seconds < 1) {
    return 'just now'
  }

  const interval = intervals.find((i) => i.seconds < seconds)
  const count = Math.floor(seconds / interval.seconds)
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago` // 1 year ago
}
export const validateDate = (date) => {
  const dateInfo = date.replaceAll('/', '-').split('-')
  if (dateInfo.length === 3) {
    if (parseInt(dateInfo[0]) > 0 && parseInt(dateInfo[1]) <= 12 && parseInt(dateInfo[2]) <= 31) {
      return new Date(date).toString() !== 'Invalid Date'
    } else {
      return false
    }
  }
  return false
}

export const urlSafeBase64Encode = (data) => {
  if (data) {
    return Buffer.from(data).toString('base64')
  }
}
export const urlSafeBase64Decode = (data) => {
  if (data) {
    return Buffer.from(data, 'base64').toString('utf-8')
  }
}
export const googleAnalyticsFunction = (to) => {
  if (window.origin === 'https://learning.appsecengineer.com' && to.name !== '') {
    ga('set', {
      page: to.path,
      title: to.name
    })
    ga('send', 'pageview')
  }
}
export const differenceDates = (startDate, endDate, todayDate) => {
  const endDateVar = new Date(endDate)
  const todayDateVar = new Date(todayDate)
  const newDiffTime = Math.abs(todayDateVar - endDateVar)

  if (todayDateVar > endDateVar) {
    return 'EXPIRED'
  } else {
    return Math.ceil(newDiffTime / (1000 * 60 * 60 * 24))
  }
}
export const monthIndexToString = (index) => {
  return months[parseInt(index)]
}

export const colorBasedOnIndex = (index) => {
  const colors = [
    '#4FA0E1',
    '#58D8A5',
    '#EC8937',
    '#6900FF',
    '#5E64EA',
    '#FF5733',
    '#6f4a8e',
    '#3282b8',
    '#00c698',
    '#0097A7',
    '#CC6699',
    '#9CCC65',
    '#FFB300',
    '#DCE775',
    '#5C6BC0',
    '#99CCFF',
    '#00ACC1',
    '#9575CD',
    '#D9B277',
    '#CACAC3',
    '#2B3766',
    '#BA674B',
    '#C9352B',
    '#8639A7',
    '#ad8528',
    '#7593C9',
    '#9de3b6',
    '#1B1B53',
    '#8787e0',
    '#bf8673',
    '#c266c4',
    '#CC9E76',
    '#C7A876',
    '#EFC5AB',
    '#90348A',
    '#164E80'
  ]
  if (index >= 0 && index < colors.length) {
    return colors[index]
  } else {
    return '#' + (((1 << 24) * Math.random()) | 0).toString(16)
  }
}
export const convertDateFormate = (dateFormate) => {
  const splitedData = dateFormate.split('-')
  const year = parseInt(splitedData[0])
  const month = months[parseInt(splitedData[1])]
  const day = parseInt(splitedData[2])
  let result = ''
  if (day) {
    result = `${day} ${month} ${year}`
  } else {
    result = `${month} ${year}`
  }
  return result // 31 January 2020
}

export const todayDate = () => {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  today = mm + '/' + dd + '/' + yyyy
  LocalStorage.set('currentDate', today)
}

export const todayDateValue = () => {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  today = mm + '/' + dd + '/' + yyyy
  return today // 01/31/2020
}
export const previousDates = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  let monthData = 0
  const minDate = new Date()
  minDate.setMonth(minDate.getMonth() - 2)
  const semiAnnual = new Date()
  semiAnnual.setMonth(semiAnnual.getMonth() - 4)
  monthData = month + 1
  return [
    { label: 'Yearly', key: 'yearly', value: [`${year - 1}-${monthData + 1}`, `${year}-${monthData + 1}`] },
    {
      label: 'Last six months',
      key: 'Last six months',
      value: [`${semiAnnual.getFullYear()}-${semiAnnual.getMonth()}`, `${year}-${monthData + 1}`]
    },
    {
      label: 'Last three months',
      key: 'Last three months',
      value: [`${minDate.getFullYear()}-${minDate.getMonth() + 1}`, `${year}-${monthData + 1}`]
    }
  ]
}
export const currentYearOld = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  let monthData = 0
  monthData = month + 1
  return { key: 'yearly', label: 'Yearly', value: [`${year - 1}-${monthData + 1}`, `${year}-${monthData + 1}`] } // 2019-12
}
export const todayDateValueAsPerQuasarDate = () => {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  today = yyyy + '/' + mm + '/' + dd
  return today // 2020/01/31
}

export const downloadCSV = (columns, rows, title) => {
  const wrapCsvValue = (val, formatFn, row) => {
    let formatted = formatFn !== undefined ? formatFn(val, row) : val
    formatted = formatted === undefined || formatted === null ? '' : String(formatted)
    formatted = formatted.split('"').join('""')
    return `"${formatted}"`
  }

  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function' ? col.field(row) : row[col.field === undefined ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
    )
    .join('\r\n')

  return exportFile(`${title}.csv`, content, 'text/csv')
}

export const convertAndDownloadChartJSDataToCSV = (chartLabels, chartData, defaultColumnName, title) => {
  console.log(chartLabels, chartData, defaultColumnName, title)

  return new Promise((resolve, reject) => {
    try {
      const defaultColumns = [
        {
          label: defaultColumnName,
          field: defaultColumnName,
          align: 'left',
          data: chartLabels
        }
      ]

      const defaultRowFormat = {}

      defaultRowFormat[defaultColumnName] = undefined

      const columns = [
        ...defaultColumns,
        ...chartData.map(({ label, data }) => {
          defaultRowFormat[label] = undefined
          return { label, field: label, align: 'left', data }
        })
      ]

      const rows = chartLabels.map((_, index) => {
        const row = { ...defaultRowFormat }
        columns.forEach(({ field, data }) => {
          row[field] = data[index]
        })
        return row
      })

      const status = downloadCSV(columns, rows, title)

      status ? resolve('') : reject('Failed to download')
    } catch (error) {
      reject(error)
    }
  })
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
