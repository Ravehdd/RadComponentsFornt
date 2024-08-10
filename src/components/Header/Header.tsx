import { Link } from "react-router-dom";
// import { authenticationSlice } from "../../store/authentication.slice";

export default function Header() {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated')


    const handleClick = () => {
      fetch("http://127.0.0.1:8000/auth/token/logout/", {
          method: "POST",
          headers: { "Content-Type": "application/json" , "Authorization": `Token ${localStorage.getItem('authToken')}`},
          // body: JSON.stringify(loginData),
          })
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.setItem('authToken', "");
      window.location.href = "/auth"

      
    }

    return (
        <nav className=" h-[50px] flex  align-start px-3 items-center bg-[#292929] text-white ">
        <span className="font-bold mx-2 text-lg">RadComponents</span>

        {storedIsAuthenticated === "true" &&
        <div className="flex justify-between w-full">
          <span>
            <Link className="mx-2 no-underline text-white" to="/">
              Main table
            </Link>
            <Link className="no-underline mx-2 text-white" to="/addorder">
              Add order
            </Link>
            <Link className="no-underline mx-2 text-white" to="/orders">
              Orders
            </Link>
            <Link className="no-underline mx-2 text-white" to="/adddevice">
              Add device
            </Link>
            <Link className="no-underline mx-2 text-white" to="/addcomponent">
              Add component
            </Link>
          </span>
          <button className="justyfy-end" onClick={() => handleClick()}>Выйти</button>
        </div>
        }
      </nav>
    )
}