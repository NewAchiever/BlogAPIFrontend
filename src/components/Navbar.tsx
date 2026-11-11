import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { PATHS } from "@/routes/routes.config";
function Navbar() {
  const { user, setIsLoggedIn, isLoggedIn, isAuthLoading, setUser, callAPI } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await callAPI('/auth/logout',
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.isSessionActive) {
        setUser(null);
        navigate(PATHS.LOGIN, {replace: true});
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

    console.log("sdfsdf", isAuthLoading);

    return (
      <>
      {
        isAuthLoading ? (
          <nav className="w-full h-[50px] bg-stone-700 text-gray-300"></nav>  
        ):
        (
        <nav className="w-full h-[50px] bg-stone-700 text-gray-300">
          <div className="flex flex-row items-center h-full justify-between mx-5">
            <div>
                <Link to="/">My Website</Link>
            </div>
            <div className="flex flex-row gap-4">
                {isLoggedIn ? (
                    <>
                        <div>
                            <Link to="/create_post">Create Post</Link>
                        </div>

                        <div>
                            <Link to="/drafts">Drafts</Link>
                        </div>
                        <div>
                            <Link to="/profile">Profile</Link>
                        </div>
                        <div>
                            <Link to="/posts">My Posts</Link>
                        </div>

                        <button onClick={() => navigate('/logout')}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <div>
                            <Link to="/login">Login</Link>
                        </div>
                        <div>
                            <Link to="/signup">Sign Up</Link>
                        </div>
                        
                    </>
                )}
            </div>
          </div>
        </nav>
        )
    }
    </>
  )
    
     
}

export default Navbar;