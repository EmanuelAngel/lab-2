export function buildUpdateQuery(input) {
  const updateFields = []
  const updateValues = []

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      updateFields.push(`${key} = ?`)
      updateValues.push(value)
    }
  }

  return { updateFields, updateValues }
}
