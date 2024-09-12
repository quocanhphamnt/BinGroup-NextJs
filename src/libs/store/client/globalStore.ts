import { getCookie } from 'cookies-next'
import { create } from 'zustand'

interface DataGlobal {
  lang: string
  location: string
  currency: string
  langUrlSlashed: string
  country: string
  isShowCookieConsent: boolean
  isShowCookieConsentSetting: boolean
  infoBtnSettingToggleModal: boolean
  detailDefaultCountry: CountryType | null
  updateGlobalStore: (key: string, value: string | boolean | Record<string, string>) => void
}

const useGlobalStore = create<DataGlobal>()((set) => ({
  lang: getCookie('__language') as string,
  location: getCookie('__location') as string,
  currency: getCookie('__currency') as string,
  country: getCookie('__country') as string,
  detailDefaultCountry: null,
  langUrlSlashed: '',
  isShowCookieConsent: false,
  isShowCookieConsentSetting: false,
  infoBtnSettingToggleModal: false,
  updateGlobalStore: (key, value) => set({ [key]: value })
}))

export default useGlobalStore
