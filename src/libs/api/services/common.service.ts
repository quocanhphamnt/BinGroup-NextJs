import { NEXT_PUBLIC_LOAD_META_DATA } from '@/constants/env'
import { useFetch, useGenerateMetadata } from '@/libs/utils/utilFuncs'
import type { LocationsResponseData, PageMetaDataResponse } from '@/types/common'

const commonService = {
  /**
   * Generates metadata for a webpage.
   * @param {string} pageKeyword - The keyword for the page.
   * @param {string} lang - The language for the page metadata.
   * @param {string} location - The location for the page metadata.
   * @param {string} [customPageKeyword] - Optional custom page keyword.
   * @returns {Promise<object> | boolean} A promise that resolves to the metadata object.
   */
  async generatePageMetaData(
    pageKeyword: string,
    lang: string,
    location: string,
    customPageKeyword?: string
  ): Promise<object | boolean> {
    const response = await useFetch<PageMetaDataResponse | null>(`page/${pageKeyword}`, lang, location)

    if (!response.success) return false

    if (!NEXT_PUBLIC_LOAD_META_DATA) return {}

    // Get list location, languages from Api
    const responseLocation = await useFetch<LocationsResponseData[] | null>(`location`, lang, location)

    return await useGenerateMetadata({
      current_url: customPageKeyword ? customPageKeyword : pageKeyword || '',
      page_meta_description: response?.data?.page_meta_description || '',
      page_meta_image: response?.data?.page_meta_image || '',
      page_meta_keyword: response?.data?.page_meta_keyword || '',
      title: response?.data?.page_title || '',
      page_name: response?.data?.page_name || '',
      all_locations: responseLocation.success ? responseLocation.data || [] : [],
      lang: lang,
      location: location
    })
  }
}

export default commonService
