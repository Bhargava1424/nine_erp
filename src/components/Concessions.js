import React from "react";
import Navbar from "./Navbar";
function Concessions({ userRole }){
    return(
        <><Navbar userRole={userRole} />Concessions Component</>
    );
}
export default Concessions;