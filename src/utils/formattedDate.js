export const formattedDate = (date) => {
    return new Date(date).toLocalDateString("en-us",{
        month:"long",
        date:"numeric",
        year:"numeric"
    })
}