import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "../routes/routes.config";
function Navbar() {
  const { user, isLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();
  console.log("logged", isLoggedIn);
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost/api/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser(null);
        navigate(PATHS.LOGIN, {replace: true});
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full h-[50px] bg-stone-700 text-gray-300">
      <div className="flex flex-row items-center h-full justify-between mx-5">
        <div>
            <Link to="/">My Website</Link>
        </div>
        <div className="flex flex-row gap-4">
            {isLoggedIn ? (
                <>
                    <div>
                        <Link to="/profile">Profile</Link>
                    </div>
                    <div>
                        <Link to="/posts">My Posts</Link>
                    </div>

                    <span>Welcome, {user?.username}</span>

                    <button onClick={handleLogout}>
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
  );
}

export default Navbar;