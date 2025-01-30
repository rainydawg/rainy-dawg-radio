'use client'
import { useEffect, useRef, useState } from "react";
import styles from "./Player.module.scss";
import PlayButton from "./PlayButton";
import Image from "next/image";

const STREAM_SRC = "http://166.62.119.4:8000/stream";

function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function playPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  const [spins, setSpins] = useState<any>(null);

  async function updateSpins() {
    const res = await fetch("/api/spins");
    const spins = await res.json();
    //console.log(spins.music);
    setSpins(spins);
  }

  const [timerHandle, setTimerHandle] = useState<any>();
  useEffect(() => {
    updateSpins();

    const handle = setInterval(() => {
      updateSpins();
      // console.info("Getting spins");
    }, 1000);
    setTimerHandle(handle);

    return () => clearInterval(timerHandle);
  }, []);

  return (
    <div className="player flex flex-col border-t-2 border-gray bg-white bottom-0 left-0 w-full sticky">
        <div className="flex items-center justify-between px-5 py-2 space-x-4">
          <div className="flex items-center space-x-4">
            <section>
              <div>
                {spins && spins.image != "loading" && spins.image != null ? (<Image src={spins.image}  width={50} height={50} alt={"album cover"}/>) : (<></>)}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center space-x-4">
                <p>
                  {spins ? (<span className="font-mono font-semibold">{spins.music}</span>) : (<></>)}
                </p>
                <div id="liveCircle" className="inline w-2 h-2 bg-red-500 rounded-full"></div>
              </div>

              <div>
                <p>
                  <span className="text-gray-500">by </span>
                  {spins ? (<span>{spins.artist}</span>) : (<></>)}
                </p>
              </div>
            </section>
          </div>

          <PlayButton />

          <section>
            <p className="text-gray-500">Playing on</p>
            <div>
              {spins ? (<span className="font-bold">{spins.title}</span>) : (<></>)}
            </div>
          </section>

        </div>
    </div>

  );
}

export default Player;