//**....base url */ 
const URL = `http://blogs2.csm.linkpc.net/api/v1`;
const baseUrl = URL; // Alias for consistency

//**....token*/
const getToken = () =>{
    let tokenValue = localStorage.getItem('token');
    return tokenValue;
}

const setToken = (tokenValue) =>{
    localStorage.setItem('token', tokenValue);
}

// Initialize global token variable
const token = getToken();