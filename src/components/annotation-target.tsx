import Image from "next/image";
import { Card } from "./ui/card";
import { Expand } from "lucide-react";

export default function AnnotationTarget({ imageUrl }: { imageUrl: string }) {
  const onClickExpand = () => {
    console.log("Expand image clicked");
  }
  return (
    <Card className="flex-1 mx-5 mt-5 flex flex-col md:flex-row items-center justify-center p-5">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Card className="p-0 overflow-hidden w-full flex items-center justify-center relative">
          <Image src={imageUrl} alt="Annotation Target" width={300} height={200} className="w-full" />
          <button onClick={onClickExpand} className="absolute top-2 right-2">
            <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
          </button>
        </Card>
      </div >
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-5 md:mt-0">
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
        <p>sample</p>
      </div>
    </Card >
  )
}