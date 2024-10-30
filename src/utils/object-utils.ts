export function deepClone(obj: any, replaceIds = false) {
  if (obj === null || typeof obj !== 'object') return obj

  // Verifica e clona arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item, replaceIds))
  }

  // Clona objetos
  const clonedObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Se a chave for "id" e a opção replaceIds for true, gera um novo UUID
      if (replaceIds && key === 'id') {
        clonedObj[key] = uuidv4()
      } else {
        clonedObj[key] = deepClone(obj[key], replaceIds)
      }
    }
  }
  return clonedObj
}
