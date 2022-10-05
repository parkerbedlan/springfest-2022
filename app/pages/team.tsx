import Layout from "app/core/layouts/Layout"
import { BlitzPage, Routes, useRouter } from "blitz"
import { useEffect } from "react"

const Team: BlitzPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(Routes.NewTeamPage())
  }, [router])
  return <>Redirecting...</>
}

Team.suppressFirstRenderFlicker = true
Team.getLayout = (page) => <Layout title="Team Registration">{page}</Layout>

export default Team
