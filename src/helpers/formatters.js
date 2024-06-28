const formatedDate = (initialDate) => {
  const date = new Date(initialDate)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
const formatedDateWithTime = (initialDate) => {
  console.log(initialDate)
  const date = new Date(initialDate)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${day}.${month}.${year} - ${hours}:${minutes}`
}
const formatedGender = (gender) => {
  switch (gender) {
    case "Male":
      return "Мужской"
    case "Female":
      return "Женский"
  }
}
const formatedConclusion = (conclusion) => {
  switch (conclusion) {
    case "Disease":
      return "Болезнь"
    case "Recovery":
      return "Выздоровление"
    case "Death":
      return "Смерть"
  }
}
const formatedDiagType = (type) => {
  switch (type) {
    case "Main":
      return "Основной"
    case "Concomitant":
      return "Сопутствующий"
    case "Complication ":
      return "Осложнение"
  }
}

export {
  formatedDate,
  formatedGender,
  formatedConclusion,
  formatedDiagType,
  formatedDateWithTime,
}
