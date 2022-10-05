import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrg from "app/orgs/queries/getOrg"
import deleteOrg from "app/orgs/mutations/deleteOrg"
import {
  Box,
  Button,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import getOrgMembers from "app/orgs/queries/getOrgMembers"
import getOrgAttendanceByActivity from "app/orgs/queries/getOrgAttendanceByActivity"

export const Org = () => {
  const router = useRouter()
  const orgId = useParam("orgId", "number")
  const [deleteOrgMutation] = useMutation(deleteOrg)
  const [org] = useQuery(getOrg, { id: orgId })

  return (
    <>
      <Head>
        <title>{org.name}</title>
      </Head>

      <div>
        <Text fontSize="3xl">{org.name}</Text>
        {/* <pre>{JSON.stringify(org, null, 2)}</pre> */}

        <Tabs>
          <TabList>
            <Tab>Member List</Tab>
            <Tab>By Activity</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{orgId && <OrgMemberList orgId={orgId} />}</TabPanel>
            <TabPanel>{orgId && <ByActivity orgId={orgId} />}</TabPanel>
          </TabPanels>
        </Tabs>

        <BlitzChakraLink href={Routes.EditOrgPage({ orgId: org.id })} color="default">
          <Button>Edit</Button>
        </BlitzChakraLink>

        <Button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteOrgMutation({ id: org.id })
              router.push(Routes.OrgsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </Button>
      </div>
    </>
  )
}

const ByActivity: React.FC<{ orgId: number }> = ({ orgId }) => {
  const [attendanceByActivity] = useQuery(getOrgAttendanceByActivity, { orgId })
  return (
    <Suspense fallback="Loading...">
      <Table>
        <Thead>
          <Tr>
            <Th>Activity</Th>
            <Th>Attendance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendanceByActivity.map((activity) => (
            <Tr key={activity.id}>
              <Td>{activity.name}</Td>
              <Td>{activity.attendance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Suspense>
  )
}

const OrgMemberList: React.FC<{ orgId: number }> = ({ orgId }) => {
  const [members] = useQuery(getOrgMembers, { id: orgId })
  return (
    <Box>
      <Text fontSize={"xl"}>Members</Text>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>TU ID</Th>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {members.map((member) => (
            <Tr key={member.tuid}>
              <Td>{member.tuid}</Td>
              <Td>{member.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* <pre>{JSON.stringify(members, null, 2)}</pre> */}
    </Box>
  )
}

const ShowOrgPage: BlitzPage = () => {
  return (
    <Wrapper>
      <BlitzChakraLink href={Routes.OrgsPage()} color="default">
        <Button>{"< "}Orgs</Button>
      </BlitzChakraLink>

      <Suspense fallback={<div>Loading...</div>}>
        <Org />
      </Suspense>
    </Wrapper>
  )
}

ShowOrgPage.authenticate = true
ShowOrgPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowOrgPage
