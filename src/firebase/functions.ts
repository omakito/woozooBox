import type { AuthStore } from '@/model/auth'
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where,
  updateDoc,
  orderBy,
  limit,
  deleteDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './config'
import type { CampaignType, UserData } from '@/model/model'

let authStore: AuthStore | null = null

async function getAuthStore() {
  if (!authStore) {
    const { useAuthStore } = await import('@/stores/auth')
    authStore = useAuthStore()
  }
  return authStore
}

export async function getCollectionData(collectionName: string) {
  const querySnapshot = await getDocs(query(collection(db, collectionName)))
  const data = querySnapshot.docs.map(doc => doc.data())

  return data
}

export async function getCampaigns(): Promise<CampaignType[]> {
  const authStore = await getAuthStore()
  const querySnapshot = await getDocs(
    query(
      collection(db, 'campaign'),
      where('codeCompany', '==', authStore.userData?.code),
    ),
  )
  const data = querySnapshot.docs.map(doc => doc.data()) as CampaignType[]

  return data
}
export async function getCampaignsByStartDate(
  startDate: Date,
): Promise<CampaignType[]> {
  const authStore = await getAuthStore()

  const querySnapshot = await getDocs(
    query(
      collection(db, 'campaign'),
      where('codeCompany', '==', authStore.userData?.code),
      where('endDate', '>=', startDate),
    ),
  )
  const data = querySnapshot.docs.map(doc => doc.data()) as CampaignType[]

  return data
}

export async function getRecentAndUpcomingCampaigns(): Promise<{
  pastCampaigns: CampaignType[]
  currentCampaigns: CampaignType[]
  upcomingCampaigns: CampaignType[]
}> {
  const today = new Date()
  const authStore = await getAuthStore()

  // Récupérer les 3 campagnes terminées les plus récentes
  const pastQuerySnapshot = await getDocs(
    query(
      collection(db, 'campaign'),
      where('codeCompany', '==', authStore.userData?.code),
      where('endDate', '<', today),
      orderBy('endDate', 'desc'),
      limit(3),
    ),
  )
  const pastCampaigns = pastQuerySnapshot.docs.map(doc =>
    doc.data(),
  ) as CampaignType[]

  // Récupérer les 3 campagnes en cours
  const currentQuerySnapshot = await getDocs(
    query(
      collection(db, 'campaign'),
      where('codeCompany', '==', authStore.userData?.code),
      where('startDate', '<=', today),
      where('endDate', '>=', today),
      orderBy('startDate', 'asc'),
      limit(3),
    ),
  )
  const currentCampaigns = currentQuerySnapshot.docs.map(doc =>
    doc.data(),
  ) as CampaignType[]

  // Récupérer les 3 prochaines campagnes à venir
  const upcomingQuerySnapshot = await getDocs(
    query(
      collection(db, 'campaign'),
      where('codeCompany', '==', authStore.userData?.code),
      where('startDate', '>', today),
      orderBy('startDate', 'asc'),
      limit(3),
    ),
  )
  const upcomingCampaigns = upcomingQuerySnapshot.docs.map(doc =>
    doc.data(),
  ) as CampaignType[]

  return { pastCampaigns, currentCampaigns, upcomingCampaigns }
}

export async function GetDataById(
  collection: string,
  id: string,
): Promise<UserData> {
  const docRef = doc(db, collection, id)
  const docSnap = await getDoc(docRef)

  return docSnap.data() as UserData
}

export const addData = async (collectionName: string, data: any) => {
  const docRef = doc(collection(db, collectionName))
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    timestamp: serverTimestamp(),
  })
  return docRef
}

export async function updateData(collectionName: string, id: string, data: {}) {
  await updateDoc(doc(collection(db, collectionName), id), data)
}

export const createCampaign = async (collectionName: string, data: any) => {
  const docRef = doc(collection(db, collectionName))

  console.log('docRef.id => ', docRef.id)

  const spotVideoUrl = await uploadSpotVideo(
    data.codeCompany,
    docRef.id,
    data.spotVideo,
  )

  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    spotVideo: spotVideoUrl,
    timestamp: serverTimestamp(),
  })
  return docRef
}

export const uploadSpotVideo = async (
  codeCompany: string,
  campaignId: string,
  imageFile: any,
) => {
  const storageRef = ref(
    storage,
    `campaignVideos/${codeCompany}/${campaignId}.jpg`,
  )

  try {
    await uploadBytes(storageRef, imageFile)
    const imageUrl = await getDownloadURL(storageRef)
    return imageUrl
  } catch (error) {
    throw new Error('Erreur lors du téléchargement de la video')
  }
}

export async function deleteData(collectionName: string, id: string) {
  await deleteDoc(doc(collection(db, collectionName), id))
}

export const debitCoins = async (coins: number): Promise<void> => {
  const authStore = await getAuthStore()
  const user = authStore.userData
  if (!user) return
  const newUserCoinsStack = user.coins - coins
  await updateData('users', user.id, { coins: newUserCoinsStack })
  await authStore.setUserData(authStore.user)
}

export const creditCoins = async (coins: number): Promise<void> => {
  const authStore = await getAuthStore()
  const user = authStore.userData
  if (!user) return
  const newUserCoinsStack = user.coins + coins
  await updateData('users', user.id, { coins: newUserCoinsStack })
  await authStore.setUserData(authStore.user)
}
