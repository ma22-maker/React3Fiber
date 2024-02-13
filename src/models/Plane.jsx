import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
//import planemic from "../assets/planemic.wav"
import helio from "../assets/helio.wav"
import planeScene from "../assets/3d/plane.glb";

// 3D Model from: https://sketchfab.com/3d-models/stylized-ww1-plane-c4edeb0e410f46e8a4db320879f0a1db
export function Plane({ isRotating, ...props }) {
  const ref = useRef();
  //audio included
  const audioRef = useRef(new Audio(helio));
  audioRef.current.volume = 0.7;
  audioRef.current.loop = true;
  // Load the 3D model and its animations
  const { scene, animations } = useGLTF(planeScene);
  // Get animation actions associated with the plane
  const { actions } = useAnimations(animations, ref);

  // Use an effect to control the plane's animation based on 'isRotating'
  // Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.
  useEffect(() => {
    if (isRotating) {
      actions["Take 001"].play();
      audioRef.current.play();
    } else {
      actions["Take 001"].stop();
      audioRef.current.pause();
    }
  }, [actions, isRotating]);

  return (
    <mesh {...props} ref={ref}>
      // use the primitive element when you want to directly embed a complex 3D
      model or scene
      <primitive object={scene} />
    </mesh>
  );
}
