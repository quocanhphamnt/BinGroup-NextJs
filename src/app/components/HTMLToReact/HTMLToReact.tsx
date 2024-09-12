/* eslint-disable no-case-declarations */
import type { DOMNode, Element, HTMLReactParserOptions } from 'html-react-parser'
import parse, { attributesToProps, domToReact } from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'
import type { Attributes } from 'react'
import React, { Suspense, createElement } from 'react'
import Leadform from '../LeadForm'

type CustomTag = {
  tag: string
  component: React.FC
}

// Define a function component 'HTMLToReact' that takes a 'html' string as a prop
export const HTMLToReact = ({
  html,
  customTags,
  components
}: {
  html: string
  customTags?: CustomTag[]
  components?: CustomTag[]
}) => {
  if (!html || typeof html !== 'string') return html

  // Define options for the 'html-react-parser'
  const options: HTMLReactParserOptions = {
    // The 'replace' function is called for each node in the HTML string
    replace: (domNode) => {
      const typedDomNode = domNode as Element

      if (!typedDomNode.attribs) return null

      const customTag = customTags?.find((tag) => tag.tag === typedDomNode.name)

      if (customTag) {
        return createElement(customTag.component, attributesToProps(typedDomNode.attribs))
      }

      // Custom component get content first div tag element inside push to content props component
      const customComponents = components?.find((tag) => tag.tag === typedDomNode.name)

      if (customComponents) {
        if (customComponents) {
          const elementNode = domNode as Element
          const content: React.ReactElement[] = []

          elementNode.children?.forEach((child) => {
            if (child.type === 'tag' && (child as Element).name === 'div') {
              const divNode = child as Element
              content.push(<div>{domToReact([divNode], options)}</div>)
            }
          })

          return createElement(customComponents.component, {
            ...attributesToProps(elementNode.attribs),
            content: content
          } as Attributes & { content: React.ReactElement[] })
        }
      }

      switch (typedDomNode.name) {
        case 'a':
          const props = attributesToProps(typedDomNode.attribs)

          return (
            <Link href={props.href as string} {...attributesToProps(typedDomNode.attribs)} prefetch={true}>
              {typedDomNode.children && domToReact(typedDomNode.children as DOMNode[], options)}
            </Link>
          )

        case 'br':
          return <br {...attributesToProps(typedDomNode.attribs)}></br>

        case 'lead-form':
          return <Leadform />

        case 'img':
          // Convert the node's attributes to React props
          const propsImg = attributesToProps(typedDomNode.attribs)

          // Return an 'Image' component with the node's attributes as props
          const checkDefinition = () => {
            if (propsImg.fill === 'true') {
              return {
                fill: propsImg.fill === 'true'
              }
            }

            if (propsImg.width && propsImg.height) {
              return {
                width: parseInt((propsImg.width || 100) as string),
                height: parseInt((propsImg.height || 100) as string)
              }
            }

            return {
              width: parseInt((propsImg.width || 100) as string),
              height: parseInt((propsImg.height || 100) as string),
              className: `${propsImg.className} w-auto h-auto`
            }
          }

          return (
            <Image
              src={(propsImg['data-src'] as string) || (propsImg.src as string) || 'oneibccom'}
              alt={(propsImg.alt as string) || 'oneibccom'}
              title={(propsImg.title as string) || 'oneibccom'}
              className={`${propsImg.className}` as string}
              loading={propsImg.loading as 'lazy' | 'eager'}
              decoding={propsImg.decoding as 'sync' | 'async' | 'auto'}
              style={propsImg.style}
              quality={parseInt(propsImg.quality as string)}
              priority={propsImg.priority === 'true'}
              placeholder={propsImg.placeholder as 'empty' | 'blur'}
              blurDataURL={propsImg.blurDataURL as string}
              objectPosition={propsImg.objectPosition as string}
              {...checkDefinition()}
            />
          )

        case 'iframe':
          const propsIframe = attributesToProps(typedDomNode.attribs)

          // Return a 'Link' component with the node's attributes as props
          return (
            <iframe
              {...attributesToProps(typedDomNode.attribs)}
              src={(propsIframe['data-src'] as string) || (propsIframe.src as string) || 'oneibccom'}
            >
              {/* If the node has children, convert them to React elements */}
              {typedDomNode.children && domToReact(typedDomNode.children as DOMNode[], options)}
            </iframe>
          )
      }
    },
    trim: true,
    htmlparser2: {
      lowerCaseTags: false
    }
  }

  // Parse the 'html' string into React elements using the defined options

  const matches = html?.match(/<p>\|\|\|(.*?)\|\|\|<\/p>/g)

  if (matches) {
    html = html?.replace(/<p>\|\|\|(.*?)\|\|\|<\/p>/g, (_, item) => {
      return `<${item?.toLowerCase()}></${item?.toLowerCase()}>`
    })
  }

  return (
    <Suspense fallback={<div></div>}>
      {parse(html?.replaceAll('<p>&nbsp;</p>', '').replaceAll('<p></p>', ''), options)}
    </Suspense>
  )
}
