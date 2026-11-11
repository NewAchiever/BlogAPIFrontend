import { API_BASE_URL } from '@/config/api';
import type { ApiResponse } from '@/shared/types';
export const fetchAPI = async <T,>(
urlEndPoint: string, 
options: RequestInit = {},
err: string,
setIsLoggedIn:(isLoggedIn: boolean | null) => void,
setIsAuthLoading:(isAuthLoading: boolean | null) => void
): Promise<ApiResponse<T>> => {
    try{
        const responseAPI = await fetch(`${API_BASE_URL}${urlEndPoint}`, {
            ...options,
            credentials: "include"
        });

        const response = await responseAPI.json();
        const isSessionActive = response.isSessionActive;
        console.log("calling: ", urlEndPoint);
        if (response.isSessionActive === false) {
            setIsLoggedIn(false);
            setIsAuthLoading(false);
        } else if (response.isSessionActive === true) {
            setIsLoggedIn(true);
            setIsAuthLoading(false);
        }
        const success = responseAPI.ok;
        return {
            success: success,
            data: response.data,
            error: null,
            status: responseAPI.status,
            isSessionActive: isSessionActive
        };

    }
    catch(error){
        return {
            success: false,
            data: null,
            error: true,
            status: 0,
            isSessionActive: null
        };
    }
}
