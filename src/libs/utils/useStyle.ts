// import autoprefixer from 'autoprefixer'
// import CleanCSS from 'clean-css'
// import fs from 'fs'
// import postcss from 'postcss'
// import tailwindcss from 'tailwindcss'
// import tailwindSetting from '../../tailwind.config'

// /**
//  * This function generates CSS styles using Tailwind CSS.
//  * It receives an object with the following structure:
//  * {
//  *    "listClassTailwind": "bg-red-500 w-[434px]",
//  *    "page_keyword":"contact-1"
//  * }
//  * The "listClassTailwind" field contains the Tailwind CSS classes to be applied.
//  * The "page_keyword" field is used to set the mode in the Tailwind CSS configuration.
//  *
//  * The function generates a temporary HTML file with the provided classes, processes it with Tailwind CSS in JIT mode,
//  * and then deletes the temporary file. The resulting CSS is returned.
//  *
//  * @param {Object} params - The parameters for generating the styles
//  * @param {string} params.listClassTailwind - The Tailwind CSS classes to be applied
//  * @param {string} params.page_keyword - The mode for the Tailwind CSS configuration
//  * @returns {string} - The generated CSS
//  */
// export async function useGetStyles({
//   listClassTailwind,
//   pageContent,
//   pageKeyword
// }: {
//   listClassTailwind?: string
//   pageContent?: string
//   pageKeyword: string
// }): Promise<string> {
//   if (!listClassTailwind || typeof listClassTailwind !== 'string') return ''

//   const tempFilePath = './temp-tailwind.html'

//   const html = pageContent ? pageContent : `<div class="${listClassTailwind}"></div>`

//   fs.writeFileSync(tempFilePath, html)

//   tailwindSetting.mode = pageKeyword || 'jit'
//   tailwindSetting.purge = [tempFilePath]

//   const result = await postcss([tailwindcss(tailwindSetting), autoprefixer]).process('@tailwind utilities;', {
//     from: undefined
//   })

//   if (fs.existsSync(tempFilePath)) {
//     fs.unlinkSync(tempFilePath)
//   }

//   return new CleanCSS({}).minify(result.css).styles
// }

import autoprefixer from 'autoprefixer'
import CleanCSS from 'clean-css'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import tailwindSetting from '../../../tailwind.config'

export async function useGetStyles(listClassTailwind: string, pageKeyword: string): Promise<string> {
  if (!listClassTailwind || typeof listClassTailwind !== 'string') return ''

  const html = `<div class="${listClassTailwind}"></div>`

  const updatedTailwindSetting = {
    ...tailwindSetting,
    mode: pageKeyword || 'jit',
    content: [{ raw: html }]
  }

  const result = await postcss([
    tailwindcss(updatedTailwindSetting) as postcss.AcceptedPlugin,
    autoprefixer as postcss.AcceptedPlugin
  ]).process('@tailwind utilities;', {
    from: undefined
  })

  return new CleanCSS({}).minify(result.css).styles
}

// import autoprefixer from 'autoprefixer'
// import CleanCSS from 'clean-css'
// import fs from 'fs'
// import { type NextRequest } from 'next/server'
// import postcss from 'postcss'
// import tailwindcss from 'tailwindcss'
// import tailwindSetting from '../../tailwind.config'

// /**
//  * This function handles POST requests.
//  * It receives a JSON body with the following structure:
//  * {
//  *    "class": "bg-red-500 w-[434px]",
//  *    "page_keyword":"contact-1"
//  * }
//  * The "class" field contains the Tailwind CSS classes to be applied.
//  * The "page_keyword" field is used to set the mode in the Tailwind CSS configuration.
//  *
//  * The function generates a temporary HTML file with the provided classes, processes it with Tailwind CSS in JIT mode,
//  * and then deletes the temporary file. The resulting CSS is returned in the response.
//  *
//  * @param {NextRequest} request - The incoming request
//  * @returns {Response} - The response containing the generated CSS
//  */
// export async function useGetStyles(listClassTailwind: string, pageKeyword: string): Promise<string> {
//   const tempFilePath = './temp-tailwind.html'

//   if (fs.existsSync(tempFilePath)) {
//     fs.unlinkSync(tempFilePath)
//   }

//   // const listClassTailwind = 'bg-red-500 text-white p-4 rounded-lg shadow-lg w-[3333.2px]'

//   const html = `<div class="${listClassTailwind || ''}"></div>`

//   fs.writeFileSync(tempFilePath, html) // write the HTML to a temporary file

//   // Enable JIT mode explicitly if not set in tailwind.config.js
//   tailwindSetting.mode = pageKeyword || 'jit'

//   // Directly configure purge settings in TailwindCSS configuration
//   tailwindSetting.purge = [tempFilePath]

//   const result = await postcss([tailwindcss(tailwindSetting), autoprefixer]).process('@tailwind utilities;', {
//     from: undefined
//   })

//   if (fs.existsSync(tempFilePath)) {
//     fs.unlinkSync(tempFilePath)
//   }

//   const minifiedCSS = new CleanCSS({}).minify(result.css).styles

//   return minifiedCSS
// }
