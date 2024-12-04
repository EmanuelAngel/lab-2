import cors from 'cors'

const WHITE_LIST = [
  'http://localhost:3000',
  'http://localhost:3001'
]

export const corsMiddleware = (
  { whiteList = WHITE_LIST } = {}
) =>
  cors({
    origin: (origin, callback) => {
      if (whiteList.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS!'))
    }
  })
