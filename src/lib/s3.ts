import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import config from '../config'

interface CommandData {
  Bucket: string
  Key: string
  Body: Buffer
  Metadata?: {
    alt: string
  }
}

export const uploadFileS3 = async (fileName: string, file: Buffer, alt: string | undefined = undefined): Promise<string | undefined> => {
  try {
    if (config.AWS.PUBLIC_KEY !== undefined && config.AWS.SECRET_KEY !== undefined && config.AWS.BUCKET_NAME !== undefined) {
      const client = new S3Client({
        credentials: {
          accessKeyId: config.AWS.PUBLIC_KEY,
          secretAccessKey: config.AWS.SECRET_KEY
        },
        region: config.AWS.BUCKET_REGION
      })

      let commandData: CommandData = {
        Bucket: config.AWS.BUCKET_NAME,
        Key: fileName,
        Body: file
      }

      if (alt !== undefined) {
        commandData = {
          ...commandData,
          Metadata:
        {
          alt
        }
        }
      }

      const command = new PutObjectCommand(commandData)
      await client.send(command)

      return fileName
    }
  } catch {
    throw new Error('Error uploading the file at S3')
  }
}

export const fileNameToS3Url = (fileName: string): string => {
  return `http://${config.AWS.BUCKET_NAME}.s3.${config.AWS.BUCKET_REGION}.amazonaws.com/${fileName}`
}
