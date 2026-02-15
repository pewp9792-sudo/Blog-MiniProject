//**....base url */ 
const URL = `http://blogs2.csm.linkpc.net/api/v1`

//**....token*/
const getToken = () =>{
    let token = localStorage.getItem('token');
    // console.log(token); 
    return token;
}
const setToken = () =>{
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMjksImlhdCI6MTc3MTEzNDIxOCwiZXhwIjoxNzcxNzM5MDE4fQ.n_CZmvUPaTgclh_MWE-WNc3Xmefzkutu7sk-LUnE8iI";
    localStorage.setItem('token', token);
}