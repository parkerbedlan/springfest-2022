import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
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
import {
  LoadingOverlay,
  Select,
  SelectItem,
  TransferList,
  TransferListData,
  TransferListItem,
} from "@mantine/core"
import { Org, Team } from "@prisma/client"
import checkin from "app/activities/mutations/checkin"
import deleteActivity from "app/activities/mutations/deleteActivity"
import getActivity from "app/activities/queries/getActivity"
import getAttendees from "app/activities/queries/getAttendees"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import Layout from "app/core/layouts/Layout"
import updateTeamPlacement from "app/teams/mutations/updateTeamPlacement"
import updateTeamsPresence from "app/teams/mutations/updateTeamsPresence"
import getActivityTeams from "app/teams/queries/getActivityTeams"
import {
  BlitzPage,
  Head,
  MutateFunction,
  Routes,
  useMutation,
  useParam,
  useQuery,
  useRouter,
} from "blitz"
import { Field, Form, Formik } from "formik"
import { Suspense, useEffect, useRef, useState } from "react"
import getActivityAttendanceByOrg from "../../activities/queries/getActivityAttendanceByOrg"

export const Activity = () => {
  const router = useRouter()
  const activityId = useParam("activityId", "number")
  const [deleteActivityMutation] = useMutation(deleteActivity)
  const [activity] = useQuery(getActivity, { id: activityId })

  return (
    <>
      <Head>
        <title>{activity.name}</title>
      </Head>

      <div>
        <Flex alignItems="center">
          <BlitzChakraLink href={Routes.ActivitiesPage()} color="default" mr="4">
            <Button>{"< "}Activities</Button>
          </BlitzChakraLink>
          <Text fontSize={"3xl"}>
            {activity.name} ({activity.date})
          </Text>
        </Flex>
        {/* <pre>{JSON.stringify(activity, null, 2)}</pre> */}
        <Tabs>
          <TabList>
            <Tab>Attendance</Tab>
            <Tab>By Org</Tab>
            {/* <Tab>Teams</Tab> */}
            <Tab>Competition</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{activityId && <Attendance activityId={activityId} />}</TabPanel>
            <TabPanel>{activityId && <ByOrg activityId={activityId} />}</TabPanel>
            {/* <TabPanel>{activityId && <Teams activityId={activityId} />}</TabPanel> */}
            <TabPanel>{activityId && <Competition activityId={activityId} />}</TabPanel>
          </TabPanels>
        </Tabs>

        {/* <BlitzChakraLink
          href={Routes.EditActivityPage({ activityId: activity.id })}
          color="default"
        >
          <Button>Edit</Button>
        </BlitzChakraLink>

        <Button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteActivityMutation({ id: activity.id })
              router.push(Routes.ActivitiesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </Button> */}
      </div>
    </>
  )
}

const Teams: React.FC<{ activityId: number }> = ({ activityId }) => {
  return <>teams</>
}

const Competition: React.FC<{ activityId: number }> = ({ activityId }) => {
  const [updateTeamsPresenceMutation] = useMutation(updateTeamsPresence)

  const [teamsQuery, { refetch: refetchTeamsQuery }] = useQuery(getActivityTeams, { activityId })
  useEffect(() => {
    if (teamsQuery) {
      let newTeamsTransferListData = [[], []] as TransferListData
      teamsQuery.forEach((team) => {
        const teamTransferListItem = { value: "" + team.id, label: team.name } as TransferListItem
        if (team.present) {
          newTeamsTransferListData[1].push(teamTransferListItem)
        } else {
          newTeamsTransferListData[0].push(teamTransferListItem)
        }
      })
      setTeamsTransferListData(newTeamsTransferListData)

      setPresentTeams(teamsQuery.filter((team) => team.present))
    }
  }, [teamsQuery])

  const [teamsTransferListData, setTeamsTransferListData] = useState<TransferListData>([[], []])
  const [isLoading, setIsLoading] = useState(false)

  const [presentTeams, setPresentTeams] = useState<Team[]>([])

  return (
    <Suspense fallback="Loading...">
      <LoadingOverlay visible={isLoading} />
      <TransferList
        value={teamsTransferListData}
        onChange={async (value: TransferListData) => {
          setIsLoading(true)

          console.log(value)
          let teamPresenceList: any[] = []
          value[0].forEach((team) =>
            teamPresenceList.push({ id: parseInt(team.value), present: false })
          )
          value[1].forEach((team) =>
            teamPresenceList.push({ id: parseInt(team.value), present: true })
          )
          await updateTeamsPresenceMutation({ teamPresenceList })

          await refetchTeamsQuery()
          setIsLoading(false)
        }}
        searchPlaceholder="Search..."
        nothingFound="Nothing here"
        titles={["Absent☹", "Present😄"]}
        showTransferAll={false}
      />
      <Placement
        presentTeams={presentTeams}
        setIsLoading={setIsLoading}
        onRefetch={refetchTeamsQuery}
      />
    </Suspense>
  )
}

const placeToString = ["1st", "2nd", "3rd", "4th"]

const Placement: React.FC<{
  presentTeams: Team[]
  onRefetch: () => Promise<any>
  setIsLoading: (newIsLoading: boolean) => void
}> = ({ presentTeams, onRefetch, setIsLoading }) => {
  const [updateTeamPlacementMutation] = useMutation(updateTeamPlacement)

  const [teamSelectItems, setTeamSelectItems] = useState<SelectItem[]>([
    { value: "-1", label: "Undecided" },
  ])

  useEffect(() => {
    setTeamSelectItems([
      ...presentTeams.map((team) => ({ value: "" + team.id, label: team.name })),
      { value: "-1", label: "Undecided" },
    ])
  }, [presentTeams])

  return (
    <>
      {[1, 2, 3, 4].map((place) => (
        <Box key={place} w="50%" my="4">
          <Select
            label={`${placeToString[place - 1]} Place`}
            placeholder={`${placeToString[place - 1]} Place`}
            value={"" + (presentTeams.find((team) => team.placement === place)?.id || -1)}
            onChange={async (newValue) => {
              const oldPlacers = presentTeams.filter((team) => team.placement === place)
              if (oldPlacers.length > 0) {
                setIsLoading(true)
                await Promise.all(
                  oldPlacers.map(async (oldPlacer) => {
                    await updateTeamPlacementMutation({ id: oldPlacer.id, placement: undefined })
                    return null
                  })
                )
                await onRefetch()
              }
              if (newValue && newValue !== "-1") {
                setIsLoading(true)
                await updateTeamPlacementMutation({ id: parseInt(newValue), placement: place })
                await onRefetch()
              }
              setIsLoading(false)
            }}
            data={teamSelectItems}
          />
        </Box>
      ))}
    </>
  )
}

const ByOrg: React.FC<{ activityId: number }> = ({ activityId }) => {
  const [attendanceByOrg] = useQuery(getActivityAttendanceByOrg, { activityId })
  return (
    <Suspense fallback="Loading...">
      <Table>
        <Thead>
          <Tr>
            <Th>Org</Th>
            <Th>Attendance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendanceByOrg.map((org) => (
            <Tr key={org.id}>
              <Td>{org.name}</Td>
              <Td>{org.attendance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Suspense>
  )
}

const Attendance: React.FC<{ activityId: number }> = ({ activityId }) => {
  const [checkinMutation] = useMutation(checkin)
  const [attendees, { refetch: refetchAttendees }] = useQuery(getAttendees, { id: activityId })

  return (
    <>
      <Checkin
        activityId={activityId}
        onCheckin={async (args) => {
          await checkinMutation(args)
          refetchAttendees()
        }}
      />
      <Text>{attendees.length} attendees:</Text>
      <AttendeesList attendees={attendees} />
    </>
  )
}

const Checkin: React.FC<{
  activityId: number
  onCheckin: MutateFunction<
    void,
    unknown,
    {
      activityId: number
      tuid: number
    },
    unknown
  >
}> = ({ activityId, onCheckin }) => {
  const inputRef = useRef()
  return (
    <Formik
      initialValues={{ tuid: "" }}
      onSubmit={async (values, actions) => {
        await onCheckin({ activityId, tuid: parseInt(values.tuid) })
        actions.resetForm()
        ;(inputRef.current as any).focus()
      }}
    >
      {({}) => (
        <Form>
          <Flex
            w="100%"
            h="6rem"
            bg="gray.300"
            my="4"
            alignItems={"center"}
            justifyContent="center"
          >
            <Box bg="white" p="2" borderRadius={"lg"}>
              <Field name="tuid">
                {({ form, field }) => (
                  <InputGroup>
                    <Input
                      {...field}
                      type="number"
                      id="tuid"
                      placeholder="TU ID"
                      autoFocus
                      ref={inputRef as any}
                    />
                    <InputRightAddon type="submit" as={Button}>
                      Check In
                    </InputRightAddon>
                  </InputGroup>
                )}
              </Field>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}

const AttendeesList: React.FC<{
  attendees: {
    tuid: number
    name: string
  }[]
}> = ({ attendees }) => {
  return (
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>TU ID</Th>
          <Th>Name</Th>
          <Th>Orgs</Th>
        </Tr>
      </Thead>
      <Tbody>
        {attendees.map((attendee) => (
          <Tr key={attendee.tuid}>
            <Td>{attendee.tuid}</Td>
            <Td>{attendee.name}</Td>
            <Td>{(attendee as any).orgs.map((org: Org) => org.name).join(", ")}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const ShowActivityPage: BlitzPage = () => {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <Activity />
      </Suspense>
    </Wrapper>
  )
}

ShowActivityPage.authenticate = true
ShowActivityPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowActivityPage
