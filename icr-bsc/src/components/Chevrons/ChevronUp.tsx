import React from 'react'
import Svg from './Svg'
import { SvgProps } from '../earn/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="10" height="6" viewBox="0 0 10 6" fill="none" {...props}>
      <path d="M1 5L5 1L9 5" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default Icon
