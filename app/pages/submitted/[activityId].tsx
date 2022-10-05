import { Flex, Text } from "@chakra-ui/react"
import { Loader } from "@mantine/core"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useParam } from "blitz"
import { Suspense } from "react"

const messages = {
  1: "Thanks for submitting a team for Punk Rock Spikeball! On Tuesday (March 29), please have your team show up to The Commuter Lot between 5:00-5:30pm for check in. We will begin the tournament at 5:30pm.",
  2: "Thanks for submitting a team for Country Cornhole! On Wednesday (March 30), please have your team show up to Chapman Commons (The New U) between 5:00-5:30pm for check in. We will begin the tournament at 5:30pm.",
  3: 'Thanks for submitting a team for our Art and Jazz Night! You will need to bring your artwork to TU Outdoors between 5:00-5:30pm in order for your artwork to qualify for voting purposes. You are responsible for your own supplies, but the sky\'s the limit! We will have easels to display your artwork. If you bring something that cannot be displayed on an easel, you will be responsible for displaying it yourself. The theme for your piece is "Springfest."',
}

const SubmittedTeamPage: BlitzPage = () => {
  const activityId = useParam("activityId", "number")

  return (
    <Suspense fallback="Loading">
      <Flex justifyContent={"center"} alignItems="center" direction="column" mx="15vw" h="100vh">
        <Text fontSize={{ base: "md", lg: "3xl" }}>{messages[activityId!]}</Text>
      </Flex>
    </Suspense>
  )
}

SubmittedTeamPage.suppressFirstRenderFlicker = true
SubmittedTeamPage.getLayout = (page) => <Layout title="Submitted">{page}</Layout>

export default SubmittedTeamPage
