
import { useSearchParams } from 'react-router'; 
import xPic from "../assets/twitter.png"

function Login(){


  const [searchParams]= useSearchParams();
    const errorCode = searchParams.get("error");

      const errorMessages: Record<string, string> = {
    oauth_failed: "GitHub authentication declined or failed.",
    server_error: "Something went wrong on our database server.",
    no_user: "Could not retrieve user details from GitHub.",
    github_declined:"You declined to sign in with Github"
  };

  async function onSubmit(e:any) {
    e.preventDefault()
    window.location.href= `${import.meta.env.VITE_BACKEND}/auth/github`

  }

  return (
    <div className="flex justify-center items-center">
        <section className="max-w-md p-6">
          <h1 className="text-6xl font-semibold mb-4 text-white">See what's happening in the world right now</h1>
          <form onSubmit={onSubmit} className="space-y-5 py-7">
            <button
              type="submit"
              className=" rounded-3xl transition-[font-weight] duration-200 ease-in-out [font-weight:400] hover:[font-weight:700] w-full bg-indigo-600 text-white rounded px-8 py-6 disabled:opacity-60 cursor-pointer text-4xl"
            >
              Sign in with GitHub
            </button>
          </form>
            {errorCode && errorMessages[errorCode] && (
        
               <ul className='text-l text-red-500 text-start '>
                      <li>{errorMessages[errorCode]}</li>
               </ul>
        
         )}
        
        </section>
        <img src={xPic} alt="" width={"700px"} className=''/>
    </div>
  )
}


    

export default Login;