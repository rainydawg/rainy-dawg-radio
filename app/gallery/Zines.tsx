import Image from 'next/image'
import ZineCard from './ZineCard'

type Zine = {
    coverUrl: string;
    date: string;
    link: string;
  };

const allZines: Zine[] = [
    {
        coverUrl: "/zine23.png",
        date: "2025",
        link: "https://archive.org/details/zineeee-for-ia_202505/Rainy%20Dawg%20Zine%202025/",
    },
]

const Zines = () => {
    return (
        <>
            <header>
                <Image src="/zine.png" className="mx-auto" width={400} height={400} alt={"Meet the Team"}/>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 m-8">
                {allZines.map((member, index) => (
                    <ZineCard key={index} coverUrl={member.coverUrl} date={member.date} link={member.link}/>
                ))}
            </div>
        </>
    )
}

export default Zines;
