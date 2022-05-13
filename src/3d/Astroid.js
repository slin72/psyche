import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import {TransformControls, OrbitControls, Stage} from '@react-three/drei'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import useStore from '../store'
//import Track from '../3d/Track'


export default function Astroid () {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/psyche/PsycheAsteroid1.glb')
  

  const { fov, position, astroid } = useStore( (state) => state.mutation)
  const actions = useStore( (state) => state.actions)
  // astroid = ref.position

  useFrame( ()=> { 
    return ref.current.rotation.x  +=  0.1;
  }) 

  useFrame( (astroid)=> { 
    return astroid = ref.current.position;
  })

  return (

    <group ref={ref} scale={[300, 300, 300]} position={[6000, 0, 6000]}>

      {/* the astroid */}

      <mesh
        geometry={nodes.psyche_LP001.geometry}
        material={materials.psycheAsteroid}
        rotation={[Math.PI/2, 0, 0]}
      />
   

    </group>
  )
}
