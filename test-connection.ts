import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    console.log('Testing connection...')
    console.log('Database URL:', process.env.DATABASE_URL)
    
    await prisma.$connect()
    console.log('Connection successful!')
    
    const count = await prisma.user.count()
    console.log('Total users:', count)
    
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      meta: error.meta
    })
  } finally {
    await prisma.$disconnect()
  }
}

main()