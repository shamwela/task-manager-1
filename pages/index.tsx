import Head from 'next/head'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { PrismaClient, Task } from '@prisma/client'
import { useRouter } from 'next/router'

const prisma = new PrismaClient()

export const getServerSideProps = async () => {
  const tasks = await prisma.task.findMany()
  return {
    props: { tasks },
  }
}

const Home = ({ tasks }: { tasks: Task[] }) => {
  const [taskName, setTaskName] = useState('')
  const router = useRouter()

  const createTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ taskName }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    router.reload()
  }

  const toggleCompletion = async (id: string, completed: boolean) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      body: JSON.stringify({ id, completed }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    router.reload()
  }

  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    router.reload()
  }

  return (
    <>
      <Head>
        <title>Task manager 1</title>
      </Head>

      <main className='max-w-xs'>
        <div className='flex flex-col gap-y-4'>
          {tasks.map(({ id, name, completed }) => {
            return (
              <div key={id} className='flex justify-between'>
                <span
                  onClick={() => toggleCompletion(id, completed)}
                  className={`${
                    completed ? 'line-through' : ''
                  } cursor-pointer`}
                >
                  {name}
                </span>
                <button
                  onClick={() => deleteTask(id)}
                  className='bg-red-900 px-2 py-1'
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
        <form onSubmit={createTask}>
          <input
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
            type='text'
            required
            className='px-2 py-1'
          />
          <button type='submit' className='bg-blue-600 px-2 py-1'>
            Add
          </button>
        </form>
      </main>
    </>
  )
}

export default Home
