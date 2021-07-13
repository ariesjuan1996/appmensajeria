import axios from "axios";
export const requestApi = async (
    endPoint,
    payload = {},
    method = "POST",
    headers = {},
    responseType="json"
) => {
    
    let data=await axios({
        url: `http://192.168.0.112:3000/${endPoint}`, //Endpoint
        method: method, //Método
        data: payload,
        responseType:responseType,
        headers: headers
    });
    return data.data;
};
