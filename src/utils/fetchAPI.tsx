
import { API_BASE_URL } from '@/config/api';
export const fetchAPI = async(
urlEndPoint: string, 
options: RequestInit = {},
err: string,
setIsLoggedIn:(isLoggedIn: boolean | null) => void
) => {
    try{
        const responseAPI = await fetch(`${API_BASE_URL}${urlEndPoint}`, {
            ...options,
            credentials: "include"
        })

        const response = await responseAPI.json();
        

        console.log("INSIDE FETCHAPPI", response);
        if (response.isSessionActive === false) {
            setIsLoggedIn(false);
            return null;
        } else if (response.isSessionActive === true) {
            setIsLoggedIn(true);
        }

        return response.data;

    }
    catch(error){
        console.log(err, error);
        throw error;
    }
        

}
