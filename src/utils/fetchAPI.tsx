
export async function fetchAPI(urlEndPoint:string, options: RequestInit = {}) {
    
    const response:any = fetch(urlEndPoint, {
        ...options,
        credentials: "include"
    })
    if(response.status === 401){
        window.location.href = '/login';
        return null;
    }
    return response;
}