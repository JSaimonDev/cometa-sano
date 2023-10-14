import fs from 'fs'

export const getFileExtension = (mimeType: string): string | undefined => {
  const regex = /\/([a-zA-Z0-9]+)$/
  const match = mimeType.match(regex)

  if (match != null && match.length > 1) {
    return match[1]
  } else {
    throw new Error('Invalid image extension')
  }
}

export const createFolder = (path: string): string => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  return path
}

export const fieldsInObject = (object: any, fields: string[]): string[] => {
  const missingFields: string[] = []
  fields.forEach(field => {
    if (!(field in object) || object[field] === undefined) {
      missingFields.push(field)
    }
  })
  return missingFields
}

export const throwNewError = (message: string, e: unknown): Error => {
  if (e instanceof Error) {
    throw new Error(e.message)
  } else {
    throw new Error(message)
  }
}

export const commaStringToArray = (string: string): string[] => {
  return string.split(',').map(str => str.replace(/\s+/g, ''))
}
