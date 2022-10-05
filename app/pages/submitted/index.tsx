import { Flex, Text } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"

const SubmittedPage: BlitzPage = () => {
  return (
    <Flex justifyContent={"center"} alignItems="center" h="100vh" direction="column">
      <Text fontSize="5xl">Thanks for signing up. Reign Cane!</Text>
    </Flex>
  )
}

SubmittedPage.suppressFirstRenderFlicker = true
SubmittedPage.getLayout = (page) => <Layout title="Submitted">{page}</Layout>

export default SubmittedPage
