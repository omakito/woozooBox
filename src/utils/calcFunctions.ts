import type { AuthStore } from '@/model/auth'
import { useAuthStore } from '@/stores/auth'
import type { Moment } from 'moment'
import moment from '@/utils/moment'
import type { Timestamp } from 'firebase/firestore'

const hourByDay = 6
const minutesByDay = hourByDay * 60
const secondesPerCoin = 100
const saterdayViewPerMinutes = 100
const sundayViewPerMinutes = 50
const weekViewPerMinutes = 70

export const printsCalcul = (
  printsByMinute: number,
  daysCount: number,
  boxCount: number,
) => {
  return printsByMinute * daysCount * boxCount * minutesByDay
}

// diffusion duration in minutes
export const printsDurationCalcul = (
  spotDuration: number,
  printsByminute: number,
  daysCount: number,
  boxCount: number,
) => {
  return (
    (spotDuration * printsByminute * daysCount * boxCount * minutesByDay) / 60
  )
}

export const coinsCalcul = (
  spotDuration: number,
  printsByminute: number,
  daysCount: number,
  boxCount: number,
) => {
  const durationInMinutes = printsDurationCalcul(
    spotDuration,
    printsByminute,
    daysCount,
    boxCount,
  )
  return (durationInMinutes * 60) / secondesPerCoin
}

export const userViewsCalcul = (
  printsDuration: number,
  datesRange: Timestamp[],
): number => {
  let views = 0
  const printsDurationPerDay = printsDuration / datesRange.length

  datesRange.forEach(dateRange => {
    const date = moment(dateRange)    
    const dateViews = userViewsByDayCalcul(date, printsDurationPerDay)
    views += dateViews
  })

  return views
}

export const userViewsByDayCalcul = (date: Moment, printsDuration: number) => {
  const viewsPerMinuteByDay: {
    [key: number]: number
    default: number
  } = {
    0: sundayViewPerMinutes,
    6: saterdayViewPerMinutes,
    default: weekViewPerMinutes,
  }

  const day = date.day()
  const viewPerMinutes = viewsPerMinuteByDay[day] || viewsPerMinuteByDay.default

  return printsDuration * viewPerMinutes
}

export const isUserEnoughCoins = (coins: number) => {
  const authStore: AuthStore = useAuthStore()
  const user = authStore.userData

  if (!user) return false

  return coins < user.coins
}
