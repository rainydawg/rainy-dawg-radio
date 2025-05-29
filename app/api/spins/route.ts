import { NextResponse } from "next/server";
import { redis } from "../../../redis";

type Spin = { music: string; artist: string; image: string; }
type Show = { start: string; end: string; title: string; }

const CACHE_KEY = 'spinitron:latestSpin';
const CACHE_TTL = 10; // in seconds

export const dynamic = 'force-dynamic'; // disable static caching

async function getSpins(): Promise<Spin> {
  return fetch(`https://spinitron.com/api/spins`, {
    headers: {
      'Authorization': `Bearer ${process.env.SPINITRON_API_KEY}`
    },
    cache: 'no-store'
  }).then(async (res) => {
    const spin = await res.json();
    return {
      music: spin.items[0].song,
      artist: spin.items[0].artist,
      image: spin.items[0].image
    }
  }).catch((error) => {
    console.error("Error fetching spins:", error);
    return {
      music: "Loading...",
      artist: "Loading...",
      image: ""
    }
  });
}

async function getShows(): Promise<Show> {
  return fetch(`https://spinitron.com/api/shows`, {
    headers: {
      'Authorization': `Bearer ${process.env.SPINITRON_API_KEY}`
    },
    cache: 'no-store'
  }).then(async (res) => {
    const show = await res.json();
    const startTime = new Date(show.items[0].start);
    // Extracting hours and minutes
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
  
    // Formatting the output to ensure two digits for both hours and minutes
    const formattedStartTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
  
    const endTime = new Date(show.items[0].end);
    // Extracting hours and minutes
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();
  
    // Formatting the output to ensure two digits for both hours and minutes
    const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  
    return {
      start: formattedStartTime,
      end: formattedEndTime,
      title: show.items[0].title
    }
  }).catch((error) => {
    console.error("Error fetching shows:", error);
    return {
      start: "Loading...",
      end: "Loading...",
      title: "Loading..."
    }
  });
}

export async function GET (
  request: Request
) {
  try {
    // Try to get data from cache
    const cachedData = await redis.get(CACHE_KEY);

    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // If not in cache, fetch from APIs
    const [spins, shows] = await Promise.all([getSpins(), getShows()]);
    const combinedData = { ...spins, ...shows };

    // Store data in cache
    try {
      await redis.set(CACHE_KEY, JSON.stringify(combinedData), {ex: CACHE_TTL});
    } catch (cacheError) {
      console.error("Error setting cache:", cacheError);
    }

    return NextResponse.json(combinedData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    }});
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({
      music: "Error loading...",
      artist: "Error loading...",
      image: "",
      start: "Error loading...",
      end: "Error loading...",
      title: "Error loading..."
    }, { status: 500, headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    } });
  }
}
