import type { Timestamp } from "firebase/firestore"

export type OfferType = {
  id: string
  title: string
  subTitle: string
  description: string
  boxCount: number
  duration: number
  spotDuration: number
  printsByMinute: number
  percentPromo: number
  isAvailable: boolean
}

export type UserData = {
  id: string
  code: string
  email: string
  firstName: string
  lastName: string
  city: string
  logo: string
  coins: number
}

export type BookingFormType = {
  id?: string
  boxCount: number
  duration: number
  spotDuration: number
  printsByMinute: number
  coins: number
  dateRange: Timestamp[]
  city: string
  spotVideo: File
  prints?: number
}

export type CampaignType = {
  id?: string
  codeCompany: string
  boxCount: number
  duration: number
  datesRange: Timestamp[]
  spotDuration: number
  printsByMinute: number
  coins: number
  startDate: Timestamp
  endDate: Timestamp
  city: string
  spotVideo: string
  isOffer: boolean
  offerId: string | null
}

export type impressionPeriodType = {
  period: 'week' | 'month'
  duration: number
  display: string
}