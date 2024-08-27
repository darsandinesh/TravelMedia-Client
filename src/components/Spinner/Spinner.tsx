import { Circles } from 'react-loader-spinner';

function Spinner() {
    return (
        <div
            className="spinner-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                marginLeft:'700%'
            }}
        >
            <Circles
                height="100"  
                width="100"   
                color="#5279c8"
                ariaLabel="circles-loading"
                visible={true}
            />
        </div>
    );
}

export default Spinner;
