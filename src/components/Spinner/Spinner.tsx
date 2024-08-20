// import { useState, CSSProperties } from "react";
// import ClockLoader from "react-spinners/ClipLoader";

// const override: CSSProperties = {
//     display: "block",
//     margin: "0 auto",
//     borderColor: "red",
// };

// const Spinner = () => {

//     // let [loading, setLoading] = useState(true);
//     // let [color, setColor] = useState("#ffffff");

//     return (
//         <div className="sweet-loading">
//             {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button>
//             <input 
//                 value={color} 
//                 onChange={(input) => setColor(input.target.value)} 
//                 placeholder="Color of the loader" 
//             /> */}

//             <ClockLoader
//                 // color={color}
//                 // loading={loading}
//                 cssOverride={override}
//                 size={150}
//                 aria-label="Loading Spinner"
//                 data-testid="loader"
//             />
//         </div>
//     );
// }

// export default Spinner;


// import React from 'react';
import { TailSpin, BallTriangle, Puff, Bars, DNA } from 'react-loader-spinner';
// import './Spinner.css';

function Spinner() {
    return (
        <div className="spinner-container" >
            <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
}

export default Spinner;
