import { fileNameToS3Url, uploadFileS3 } from '../lib/s3'
import { type CommandPost } from '../types'
import { commaStringToArray, getFileExtension, throwNewError } from '../utils'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export const extractAndSaveImg = async (html: string, title: string, altString: string | undefined = undefined): Promise<string> => {
  const regex = /<img[^>]*src="([^"]*base64[^"]*)"[^>]*>/gi
  let outputHtml = html

  let altArray
  if (altString !== undefined) altArray = commaStringToArray(altString)

  try {
    const matches = [...outputHtml.matchAll(regex)]

    for (let i = 0; i < matches.length; i++) {
      const base64Image = matches[i][1]

      // We remove the "data:image/...;base64," part of the base64 image source
      const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '')

      // We convert the base64 image data into a binary buffer
      const imageBuffer = Buffer.from(imageData, 'base64')

      // We extract the image type (e.g., "png", "jpg") from the base64 image source
      const typeMatch = base64Image.match(/data:image\/(\w+);/)

      if (typeMatch != null && typeMatch.length > 1) {
        const imageType = typeMatch[1]
        const fileName = `${title}-${i}.${imageType}`
        const uploadedImage = uploadFileS3(fileName, imageBuffer)
        if (uploadedImage !== undefined && altArray !== undefined) {
          const imgTagRegex = new RegExp(`<img[^>]*src="data:image/${imageType};base64,([^"]*)"[^>]*>`, 'gi')
          const imageUrl = fileNameToS3Url(fileName)
          const finalImageTag = `<img src='${imageUrl}' alt='${altArray[i]}'/>`
          // We create a regular expression that matches <img> tags with the same base64 image source.
          // This was the problem of the previous function, which created a regex of the whole encoded img
          outputHtml = outputHtml.replace(imgTagRegex, finalImageTag)
        }
      }
    }
  } catch (e) {
    throwNewError('Error extracting and saving embed image', e)
  }
  return outputHtml
}

export const createOrUpdateFeaturedImage = async (file: Express.Multer.File, title: string): Promise<string | undefined> => {
  const fileExtension = getFileExtension(file.mimetype)
  try {
    if (fileExtension !== undefined) {
      const fileName = `${title}.${fileExtension}`
      const uploadedImage = await uploadFileS3(fileName, file.buffer)
      if (uploadedImage !== undefined) {
        return fileNameToS3Url(fileName)
      } else throw new Error()
    } else {
      throw new Error('Wrong file extension')
    }
  } catch (e) {
    throwNewError('Error creating or updating featured image', e)
  }
}

export const manageImages = async (post: CommandPost, featuredImageFile: Express.Multer.File | undefined): Promise<CommandPost> => {
  // featured image
  if (featuredImageFile != null) {
    post.featuredImage = await createOrUpdateFeaturedImage(featuredImageFile, post.title)
  }

  // content images
  if (post.content !== undefined) {
    const noBase64Html = await extractAndSaveImg(post.content, post.title, post.altContent)
    post.content = DOMPurify.sanitize(noBase64Html)
  }
  return post
}
