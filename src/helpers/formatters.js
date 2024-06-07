const formatedDate = (initialDate) => {

    const date = new Date(initialDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`

}

const formatedGender = (gender) =>{
    switch(gender){
        case "Male":
            return("Мужской")
        case "Female":
            return("Женский")
    }
}
const formatedConclusion = (conclusion) =>{
    switch(conclusion){
        case "Disease":
            return("Болезнь")
        case "Recovery":
            return("Выздоровление")
        case "Death":
            return("Смерть")
    }
}

export {formatedDate, formatedGender, formatedConclusion}