import { useEffect, useState } from 'react';
import Navbar from '../Home/NavBar/NavBar';
import axiosInstance from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';

const SuccessPage = () => {
    const [error, setError] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const sessionId = query.get('session_id');
        if (sessionId) {

            const storedOrderCheck = sessionStorage.getItem("orderCheck");
            if (storedOrderCheck && JSON.parse(storedOrderCheck) === true) {
                console.log("Order already processed. Skipping API call.");
                return;
            }
            try {
                const saveData = async () => {
                    const result = await axiosInstance.post(`${userEndpoints.savePayment}?session_id=${sessionId}`)
                    if (result.data.success) {
                        toast.success('Membership updated')
                    } else {
                        toast.info('MemberShip is not updated')
                    }
                }
                saveData()

            } catch (error:any) {
                setError(error)
            }
        }
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
                {error ? (
                    <div style={{ textAlign: 'center', color: '#dc3545' }}>
                        <h1>Error</h1>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#28a745' }}>
                        <h1>Thank You!</h1>
                        <p>{'Payment Verified......'}</p>
                        <p>Your membership is now active.</p>
                    </div>
                )}
                <a href="/home" style={{ marginTop: '20px', textDecoration: 'none', color: '#007bff' }}>Go back to Home</a>
            </div>
        </>
    );
};

export default SuccessPage;
