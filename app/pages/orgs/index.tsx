import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrgs from "app/orgs/queries/getOrgs"
import { Box, Button, Flex } from "@chakra-ui/react"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import { Grid } from "@mantine/core"

const ITEMS_PER_PAGE = 100

export const OrgsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ orgs, hasMore }] = usePaginatedQuery(getOrgs, {
    orderBy: { points: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Grid m="1rem">
        {orgs.map((org) => (
          <Grid.Col key={org.id} span={4}>
            <BlitzChakraLink
              href={Routes.ShowOrgPage({ orgId: org.id })}
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              color="default"
              boxShadow="lg"
              height="5rem"
              border="1px"
              mx="4"
              p="2"
              textAlign={"center"}
            >
              {org.name}
              <br />({org.points} pts)
            </BlitzChakraLink>
          </Grid.Col>
        ))}
      </Grid>

      <Button disabled={page === 0} onClick={goToPreviousPage} mr="3">
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const OrgsPage: BlitzPage = () => {
  return (
    <Wrapper>
      <Head>
        <title>Orgs</title>
      </Head>

      <div>
        <p>
          <BlitzChakraLink href={Routes.NewOrgPage()} color="default">
            <Button>Create Org</Button>
          </BlitzChakraLink>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <OrgsList />
        </Suspense>
      </div>
    </Wrapper>
  )
}

OrgsPage.authenticate = true
OrgsPage.getLayout = (page) => <Layout>{page}</Layout>

export default OrgsPage
