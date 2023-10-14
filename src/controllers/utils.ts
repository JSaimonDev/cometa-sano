import { fileNameToS3Url, uploadFileS3 } from '../lib/s3'
import { type CommandPost } from '../types'
import { commaStringToArray, getFileExtension, throwNewError } from '../utils'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export const extractAndSaveImg = async (html: string, title: string, altString: string | undefined = undefined): Promise<string> => {
  // Create a new instance of JSDOM with the provided HTML string
  // This will allow us to manipulate the HTML as a document object model (DOM)
  const dom = new JSDOM(html)
  const document = dom.window.document
  let altArray
  if (altString !== undefined) altArray = commaStringToArray(altString)

  const images = document.getElementsByTagName('img')
  try {
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      const src = img.getAttribute('src')
      if (src !== null) {
        const typeMatch = src.match(/data:image\/(\w+);/)

        if (typeMatch != null && typeMatch.length > 1) {
          const imageType = typeMatch[1]
          const imageData = src.replace(`data:image/${imageType};base64,`, '')
          const imageBuffer = Buffer.from(imageData, 'base64')

          const fileName = `${title}-${i}.${imageType}`
          const uploadedImage = await uploadFileS3(fileName, imageBuffer)
          if (uploadedImage !== undefined && altArray !== undefined) {
            const imageUrl = fileNameToS3Url(fileName)
            img.setAttribute('src', imageUrl)
            img.setAttribute('alt', altArray[i])
          }
        }
      }
    }

    html = dom.serialize()
  } catch (e) {
    throwNewError('Error extracting and saving embed image', e)
  }
  return html
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
