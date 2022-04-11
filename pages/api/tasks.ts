import type { NextApiHandler } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiHandler: NextApiHandler = async (request, response) => {
  switch (request.method) {
    case 'GET':
      const tasks = await prisma.task.findMany()
      response.status(200).json(tasks)
      break

    case 'POST':
      const taskName = request.body.taskName
      const newTask = await prisma.task.create({
        data: {
          name: taskName,
        },
      })
      response.json(newTask)
      break

    case 'PUT':
      const { id, completed } = request.body
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          completed: !completed,
        },
      })
      response.json(updatedTask)
      break

    default:
      break
  }
}

export default apiHandler
