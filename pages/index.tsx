import Head from 'next/head'
import React, { useState } from 'react'
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

  const createTask = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <>
      <Head>
        <title>Task manager 1</title>
      </Head>

      {tasks.map(({ id, name, completed }) => {
        return (
          <div
            onClick={() => toggleCompletion(id, completed)}
            key={id}
            className={`${completed ? 'line-through' : ''} cursor-pointer`}
          >
            {name}
          </div>
        )
      })}

      <form onSubmit={createTask}>
        <input
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          type='text'
          required
        />
        <button type='submit'>Add</button>
      </form>
    </>
  )
}

export default Home
