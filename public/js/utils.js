const REFRESHED_TOKEN_STATUS = 217

/** Custom Fetch that handles requests that needs authorization.
 *  @returns    : Fetched data
 * 
 *  @url        : endpoint to which request will be send
 *  @data       : data that will be put in body of request
 *  @method     : HTTP method. POST by default
 */
authorizedFetch = (url, data={}, method="POST") => {
    let status

    return fetch(url, {
        method: method,
        headers: {
            "Authorization": localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        // if status code is 400~, 500~ throw error with the status number
        if(!res.ok)     throw res.status
        status = res.status

        return res.json()        
    })
    .then(fetchedData => {
        // REFRESHED_TOKEN_STATUS says that the last access token expired and a new one was returned. 
        // In this case save new token and send request again, but with this new token
        if(status == REFRESHED_TOKEN_STATUS) {
            localStorage.setItem("accessToken", fetchedData)
            return authorizedFetch(url, data, method)
        }

        return fetchedData
    })
}

/** custom fetch function, which will return data from server in json format
*  @returns    : Fetched data
* 
*  @url        : endpoint to which request will be send
*  @data       : data that will be put in body of request
*  @method     : HTTP method. POST by default 
*/
dataFetch = (url, data={}, method="POST") => {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(res => {
        // if status code is 400~, 500~ throw error with the status number
        if(!res.ok)     throw res.status
        return res.json()        
    })
}