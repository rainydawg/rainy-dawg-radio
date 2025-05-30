'use client'
import Image from "next/image"
import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import { client } from "../../sanity/lib/client";
import Link from "next/link";

async function getData() {
  const query = `*[_type == "post"] | order(publishedAt desc) [0..1] {
    title,
    slug,
    author,
    summary,
    mainImage {
      asset -> {
        url
      }
    },
    publishedAt,
  }`

  const res = await client.fetch(query);
  return res;
}

export default function MainCarousel() {
  const [posts, setPosts] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getData();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  if (!posts) {
    return <div className="p-10">Loading...</div>;
  }

  if (posts.length < 2) {
    return <div className="p-10">Not enough posts to display the carousel.</div>;
  }

  return (
    <Carousel>
      {/* First post */}
      <div className="flex flex-col lg:flex-row lg:p-10">
        <div className="lg:w-1/2 lg:pl-20 self-center">
          <Image
            src={posts[0]?.mainImage?.asset?.url}
            className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] object-cover"
            width={500}
            height={500}
            alt={posts[0]?.title || "Post image"}
          />
        </div>
        <div className="px-20 lg:w-1/2 lg:pr-20 self-center">
          <div>Blog Post</div>
          <div className="font-mono large-heading font-bold">
            {posts[0]?.title}
          </div>
          <div className="py-5 hidden lg:flex">
            {posts[0]?.summary}
          </div>
          <div>
            <Link href={`/blog/${posts[0]?.slug?.current}`} className="hover:underline">
              Read more
            </Link>
          </div>
        </div>
      </div>

      {/* Second post */}
      <div className="flex flex-col lg:flex-row lg:p-10">
        <div className="lg:w-1/2 lg:pl-20 self-center">
          <Image
            src={posts[1]?.mainImage?.asset?.url}
            className="w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] object-cover"
            width={500}
            height={500}
            alt={posts[1]?.title || "Post image"}
          />
        </div>
        <div className="px-20 lg:w-1/2 lg:pr-20 self-center">
          <div>Blog Post</div>
          <div className="font-mono large-heading font-bold">
            {posts[1]?.title}
          </div>
          <div className="py-5 hidden lg:flex">
            {posts[1]?.summary}
          </div>
          <div>
            <Link href={`/blog/${posts[1]?.slug?.current}`} className="hover:underline">
              Read more
            </Link>
          </div>
        </div>
      </div>
    </Carousel>
  );
}
