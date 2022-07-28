$("form").on("submit", e => {
    e.preventDefault()
    email = $("input[name='email']")[0].value.toLowerCase();
    password = $("input[name='password']")[0].value

    fetch('', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
        // takes Response Stream™ and makes Promise that resolves in object returned by request made above
    }).then(res => {
        // throw error if status is 400~, 500~
        if(!res.ok)     throw res.status

        return res.json()
    })
    /**  @data : object resolved from Promise above. Contains Access and Refresh Tokens */
    .then(data => {
        localStorage.setItem("accessToken", data)
        window.location.replace("/admin")
    })
    .catch(err => {
        $(".email-err").css("visibility", "hidden")
        $(".pass-err").css("visibility", "hidden")

        switch(err) {
            // admin with given email not found
            case 404:
                $(".email-err").css("visibility", "visible")
                break 
            // invalid password
            case 401:
                $(".pass-err").css("visibility", "visible")
                break 
        }
    })
})