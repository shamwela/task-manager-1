import Link from 'next/link'

const Custom404 = () => {
  return (
    <>

      <h1>Sorry. Page not found.</h1>
      <Link href='/'>
        <a>Go to the home page</a>
      </Link>
    </>
  )
}

export default Custom404
