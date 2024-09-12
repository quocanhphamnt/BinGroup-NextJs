interface Props {
  className?: string
  fill?: string
}

export default function BarsIcon({ className, fill }: Props) {
  return (
    <svg className={className} xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill={fill || '#333333'}>
      <path
        d='M21 6H3C2.448 6 2 6.447 2 7C2 7.553 2.448 8 3 8H21C21.552 8 22 7.553 22 7C22 6.447 21.552 6 21 6Z'
        fill={fill || '#333333'}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <path
        d='M20.5714 10.9999H3.42857C2.64 10.9999 2 11.4469 2 11.9999C2 12.5529 2.64 12.9999 3.42857 12.9999H20.5714C21.36 12.9999 22 12.5529 22 11.9999C22 11.4469 21.36 10.9999 20.5714 10.9999Z'
        fill={fill || '#333333'}
        fillRule='evenodd'
        clipRule='evenodd'
      />
      <path
        d='M20.75 15.9999H13.25C12.56 15.9999 12 16.4469 12 16.9999C12 17.5529 12.56 17.9999 13.25 17.9999H20.75C21.44 17.9999 22 17.5529 22 16.9999C22 16.4469 21.44 15.9999 20.75 15.9999Z'
        fill={fill || '#333333'}
        fillRule='evenodd'
        clipRule='evenodd'
      />
    </svg>
  )
}
