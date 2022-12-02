import { Button } from "ui";
import Navbar from "../components/Navbar";
import Link from 'next/link';

export default function Web() {
  return (
    <div className="w-full">
      <Navbar/>
      <div className="flex flex-column w-screen h-screen justify-content-center align-items-center fadein animation-duration-400">
        <span className="text-center mb-4 text-8xl">
          The best <span className="bg-blue-400">TODO</span> app ever. 
        </span>
        <span className="text-center text-2xl">
          And the best marketing you have ever seen. I bet you will leave all your <span className="bg-green-400">money</span> here.
        </span>
        <span className="p-3 my-2 text-3xl">Go <Link className="bg-cyan-100 marketing-link" href={'/register'}>register</Link> NOW and make me some money!</span>
        <span>Thanks!</span>
      </div>

    </div>
  )
}
