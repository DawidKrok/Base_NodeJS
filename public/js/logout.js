$("#logout").on("click", () => {
    dataFetch("/logout")
    location.reload()
})
