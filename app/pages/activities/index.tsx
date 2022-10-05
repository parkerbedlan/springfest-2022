import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getActivities from "app/activities/queries/getActivities"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import { Box, Button, Flex } from "@chakra-ui/react"

const ITEMS_PER_PAGE = 100

export const ActivitiesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ activities, hasMore }] = usePaginatedQuery(getActivities, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <Box>
      <Flex height="80vh" alignItems={"center"}>
        {activities.map((activity) => (
          <BlitzChakraLink
            href={Routes.ShowActivityPage({ activityId: activity.id })}
            key={activity.id}
            display="flex"
            justifyContent={"center"}
            alignItems="center"
            color="default"
            boxShadow="lg"
            height="4rem"
            width="30%"
            border="1px"
            mx="4"
          >
            {activity.date}: {activity.name}
          </BlitzChakraLink>
        ))}
      </Flex>

      {/* <Button disabled={page === 0} onClick={goToPreviousPage} mr="3">
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button> */}
    </Box>
  )
}

const ActivitiesPage: BlitzPage = () => {
  return (
    <Wrapper>
      <Head>
        <title>Activities</title>
      </Head>

      <div>
        {/* <BlitzChakraLink href={Routes.NewActivityPage()} color="default">
          <Button>Create Activity</Button>
        </BlitzChakraLink> */}

        <Suspense fallback={<div>Loading...</div>}>
          <ActivitiesList />
        </Suspense>
      </div>
    </Wrapper>
  )
}

ActivitiesPage.authenticate = true
ActivitiesPage.getLayout = (page) => <Layout>{page}</Layout>

export default ActivitiesPage
