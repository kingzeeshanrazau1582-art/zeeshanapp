import { db } from '@/lib/db'
import crypto from 'crypto'

async function seedAdmin() {
  const email = 'admin@mediaplatform.com'
  const password = crypto.createHash('sha256').update('admin123').digest('hex')

  const existing = await db.user.findUnique({ where: { email } })
  if (!existing) {
    await db.user.create({
      data: {
        email,
        password,
        name: 'Admin',
        role: 'admin',
      },
    })
    console.log('Admin user created: admin@mediaplatform.com / admin123')
  } else {
    console.log('Admin user already exists')
  }

  // Also create a demo user
  const demoEmail = 'user@mediaplatform.com'
  const demoExisting = await db.user.findUnique({ where: { email: demoEmail } })
  if (!demoExisting) {
    await db.user.create({
      data: {
        email: demoEmail,
        password,
        name: 'Demo User',
        role: 'user',
      },
    })
    console.log('Demo user created: user@mediaplatform.com / admin123')
  }
}

seedAdmin()
  .catch(console.error)
  .finally(() => process.exit(0))
