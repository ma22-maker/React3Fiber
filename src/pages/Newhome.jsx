import { Canvas, useLoader,useThree ,useFrame} from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import { HomeInfo, Loader } from "../components";
import { FirstPersonControls } from "@react-three/drei";
import { OrbitControls, PerspectiveCamera,PointerLockControls } from "@react-three/drei";
import {  Sky } from "../models";

const Newhome = () => {
  const gltf = useLoader(GLTFLoader, "/Untitled.glb")
  const runningman = useLoader(GLTFLoader , "/running.glb")

  const cameraRef = useRef();
  const runningManRef = useRef();

  const [isRotating, setIsRotating] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [movementSpeed, setMovementSpeed] = useState(0.5);
  // const [turnSpeed, setTurnSpeed] = useState(0.05);
  // const { gl, camera } = useThree();

  const handleKeyUp= (event) => {
    if (event.key === "ArrowLeft") {
      if (!isWalking) setIsWalking(true);

      runningManRef.current.position.x -= movementSpeed;
    } else if (event.key === "ArrowRight") {
      if (!isWalking) setIsWalking(true);
       runningManRef.current.position.x += movementSpeed;
    }
  };
  
  const calculateCameraOffset = (runningManPosition) => {
    const cameraOffset = {
      x: runningManPosition.x + 3, // Place camera slightly behind and to the right
      y: runningManPosition.y + 1, // Adjust vertical offset as needed
      z: runningManPosition.z - 2, // Adjust depth offset as needed
    };
    return cameraOffset;
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeyUp);
    window.addEventListener("keyup", () => setIsWalking(false));
    return () => {
      window.removeEventListener("keydown", handleKeyUp);
      window.removeEventListener("keyup", () => setIsWalking(false));
    };
  }, []);

    
  // useFrame(() => {
  //   if (isWalking) {
  //     // Update running man's position and animation if applicable
        
  //     // Update camera position based on running man's position and offset
  //     const cameraOffset = calculateCameraOffset(runningManRef.current.position);
  //     cameraRef.current.position.set(
  //       cameraOffset.x,
  //       cameraOffset.y,
  //       cameraOffset.z
  //     );
  //   }
  // });


  const adjustScreenSizeforDesert = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [-15, -5, -30.4];
    }

    return [screenScale, screenPosition];
  };

  const [desertscale, desertPosition] = adjustScreenSizeforDesert();

  
  return (
    <section className='w-full h-screen relative'>
      <Canvas
        className="w-full h-screen bg-transparent"
       // camera={{  ref: cameraRef,near: 0.1, far: 1000 , position: [-13, 0, -12.5] }}
      >
        {/* <FirstPersonControls domElement={gl.domElement}  /> */}
         
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <hemisphereLight
            skyColor='#b1e1ff'
            groundColor='#000000'
            intensity={1}
          />
          <Sky isRotating={isRotating} /> 
          <primitive
           object={gltf.scene}
           position={desertPosition}
           scale={desertscale}
           children-0-castShadow
      />
      <group>
      <PerspectiveCamera  makeDefault ref={cameraRef} position={[-16, -3, -12.9]} rotation={[0,-1.5,0]} />
         <primitive
            object={runningman.scene}
            position={[-13, -4, -12.5]}
            rotation={[0, 20.1, 0]}
            scale={[0.6, 0.6, 0.6]}
            ref={runningManRef}
            children-0-castShadow
      />
      </group>
        </Suspense>
        {/* <OrbitControls 
        enableZoom={false}
        enablePan={false}
         minAzimuthAngle={-Math.PI / 7}
         maxAzimuthAngle={Math.PI / 7}
         minPolarAngle={Math.PI / 2}
         maxPolarAngle={Math.PI - Math.PI / 2}
         /> */}
      </Canvas>
    </section>
  );
};

export default Newhome;
