const ADMIN_ALREADY_EXISTS = "User with given email already exists",
INVALID_EMAIL = "Email not valid",
SHORT_PASS = "Password must be at least 7 characters long"


$("form").on("submit", e => {
    e.preventDefault()

    if(!validateRegistration())     return

    const email = $(".email>input")[0].value.toLowerCase()
    const password = $(".pass>input")[0].value

    fetch('register', {
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
        switch(err) {
            // status 404 means that there's already admin with given email
            case 404:
                $(".email-err").css("visibility", "visible")
                $(".email-err").html(ADMIN_ALREADY_EXISTS)
                break 
        }

    })
})


// Checks data before sending it to server and displays proper communicates
validateRegistration = () => {
    $(".email-err").css("visibility", "hidden")
    $(".pass-err").css("visibility", "hidden")
    $(".repass-err").css("visibility", "hidden")


    const email = $(".email>input")[0].value
    const password = $(".pass>input")[0].value

    // regex to validate email
    const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    var passed = true

    // checks email
    if(!email_re.test(email.toLowerCase())) {
        $(".email-err").css("visibility", "visible")
        passed = false
    }

    // checks password length
    if(password.length < 7) {
        $(".pass-err").css("visibility", "visible")
        passed = false
    }

    // Checks if passwords match
    if(password != $(".repass>input")[0].value) {
        $(".repass-err").css("visibility", "visible")
        passed = false
    }

    return passed
}
