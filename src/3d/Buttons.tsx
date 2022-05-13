
import React, { useState, Suspense } from 'react'
import {  Interactive } from '../react-xr/src/Interactions'
import { Text } from '@react-three/drei'
import useStore from '../store'

function Box({ color, size, scale, children, ...rest}: any) {
    return (
      <mesh scale={scale} {...rest}>
        <boxBufferGeometry attach="geometry" args={size} />
        <meshPhongMaterial attach="material" color={color} />
        {children}
      </mesh>
    )
  }
  

 export default function Button({camera, ...props}: any) {
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState<any>('blue')
    const [size, setSize] = useState<any>([0.4, 0.1, 0.01])
    const [text, setText] = useState<any>("Press and Track Psyche")
    const actions = useStore( (state) => state.actions)
    const toggle = useStore((state) => state.actions.toggleSound)

    // action for on
    const onSelect = () => {
      setColor((Math.random() * 0xffffff) | 0)
      setSize([0,0,0])
      setText("")
      actions.init(camera)
      toggle()
    }

    return (
      <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
        <Box rotation={[0,90,0]} color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]} size={size} {...props}>
          <Text position={[0, 0, 0.01]} fontSize={0.03} color="#000" anchorX="center" anchorY="middle">
            {text}
          </Text>
        </Box>
      </Interactive>
    )
  }