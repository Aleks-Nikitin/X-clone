
import { useSearchParams } from 'react-router'; 

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
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>

      <form onSubmit={onSubmit} className="space-y-4">

   
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60 hover:font-bold cursor-pointer"
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
  )
}


    

export default Login;