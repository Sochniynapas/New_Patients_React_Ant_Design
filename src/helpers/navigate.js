const patientsListParams = (name, conclusions = [], sorting, scheduledVisits, onlyMine, page = 1, size = 5 ) => {
  const params = new URLSearchParams({ page, size })

  if (name) params.append("name", name)
  if (sorting) params.append("sorting", sorting)
  if (scheduledVisits !== undefined)
    params.append("scheduledVisits", scheduledVisits)
  if (onlyMine !== undefined) params.append("onlyMine", onlyMine)

  conclusions.forEach((conclusion) => {
    params.append("conclusions", conclusion)
  })
  return params
}

export {patientsListParams}
