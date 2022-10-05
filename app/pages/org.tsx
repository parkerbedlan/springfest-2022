import Layout from "app/core/layouts/Layout"
import { BlitzPage, Routes, useRouter } from "blitz"
import { useEffect } from "react"

const Org: BlitzPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(Routes.NewOrgPage())
  }, [router])
  return <>Redirecting...</>
}

Org.suppressFirstRenderFlicker = true
Org.getLayout = (page) => <Layout title="Org Registration">{page}</Layout>

export default Org
