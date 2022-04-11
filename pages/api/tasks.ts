import type { NextApiHandler } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const apiHandler: NextApiHandler = async (request, response) => {
  switch (request.method) {
    case 'POST':
      const { taskName } = request.body
      const newTask = await prisma.task.create({
        data: {
          name: taskName,
        },
      })
      response.json(newTask)
      break

    case 'GET':
      const tasks = await prisma.task.findMany()
      response.status(200).json(tasks)
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

    case 'DELETE':
      const deletedTaskId = request.body.id
      const deletedTask = await prisma.task.delete({
        where: { id: deletedTaskId },
      })
      response.json(deletedTask)
      break

    default:
      break
  }
}

export default apiHandler
