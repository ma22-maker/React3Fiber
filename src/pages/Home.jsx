import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import happybk from "../assets/happybk.mp3";

import { HomeInfo, Loader } from "../components";
import { soundoff, soundon } from "../assets/icons";
import {  Island, Plane, Sky } from "../models";

const Home = () => {
  const audioRef = useRef(new Audio(happybk));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [showTooltip, setShowTooltip] = useState(true);
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {



    const tooltipTimeout = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);

    if (isPlayingMusic) {
      audioRef.current.play();
    }

    return () => {
      audioRef.current.pause();
      clearTimeout(tooltipTimeout);
    };
  }, [isPlayingMusic]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0, -6.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  return (
    <section className='w-full h-screen relative'>
      <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>
      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
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

          {/* <Bird /> */}
          <Sky isRotating={isRotating} />
          <Island
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScale}
          />
          <Plane
            isRotating={isRotating}
            position={biplanePosition}
            rotation={[0, 20.1, 0]}
            scale={biplaneScale}
          />

        </Suspense>
      </Canvas>
      <div className='relative'>
      <div className="absolute bottom-2 left-2">
        <div className="relative group">
          <img
            src={!isPlayingMusic ? soundoff : soundon}
            alt='jukebox'
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className='w-10 h-10 cursor-pointer object-contain transition-transform transform group-hover:scale-110'
          />
          {showTooltip && (
            <span className="absolute bg-sky-900 text-white text-xs px-8 py-1 rounded opacity-100 transition-opacity bottom-full left-16 transform -translate-x-1/2">
              Music ON
            </span>
          )}
        </div>
      </div>
    </div>

    <div class="relative">
  <div class="absolute bottom-4 left-[38%]">
    <span class="bg-sky-600 text-white text-xs px-8 py-3 rounded">
      Press ArrowLeft and ArrowRight to move the plane.
    </span>
  </div>
</div>
    </section>
  );
};

export default Home;
