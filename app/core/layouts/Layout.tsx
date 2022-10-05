import { Head, BlitzLayout } from "blitz"

const Layout: BlitzLayout<{title?: string}> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "springfest"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </>
  )
}

export default Layout
