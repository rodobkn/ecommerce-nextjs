"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const Social = () => {
  const onGitHubLogin = () => {
    console.log("Logeando con GitHub");
  }

  const onGoogleLogin = () => {
    console.log("logeando con Google");
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <button
        className="w-full flex items-center justify-center gap-x-2 py-3 px-4 border rounded-md border-gray-300 bg-white hover:bg-gray-100 shadow transition"
        onClick={onGoogleLogin}
      >
        <FcGoogle className="h-7 w-7" />
        <span className="text-gray-700 font-medium">Google</span>
      </button>
      <button
        className="w-full flex items-center justify-center gap-x-2 py-3 px-4 border rounded-md border-gray-300 bg-white hover:bg-gray-100 shadow transition"
        onClick={onGitHubLogin}
      >
        <FaGithub className="h-7 w-7" />
        <span className="text-gray-700 font-medium">GitHub</span>
      </button>
    </div>
  )
}
