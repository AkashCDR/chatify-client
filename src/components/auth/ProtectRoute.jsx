import React from "react"
import {Navigate} from "react-router-dom"
import {Outlet} from "react-router-dom"

const ProtectRoute=({children,user,redirect="/login"})=>{

    console.log("user which comes in protected route component",user)
    if(!user) return <Navigate to={redirect} />
    
    return children ? children : <Outlet />;
    

}
export default ProtectRoute;