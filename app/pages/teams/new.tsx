import { Link, useRouter, useMutation, BlitzPage, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTeam from "app/teams/mutations/createTeam"
import { TeamForm, FORM_ERROR } from "app/teams/components/TeamForm"
import { Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { Wrapper } from "app/core/components/Wrapper"
import { Suspense, useEffect, useState } from "react"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { LoadingOverlay, MultiSelect, Select, SelectItem } from "@mantine/core"
import getOrgs from "app/orgs/queries/getOrgs"
import getActivities from "app/activities/queries/getActivities"
import getOrgMembers from "app/orgs/queries/getOrgMembers"
import getAllOrgs from "app/orgs/queries/getAllOrgs"

const NewTeamPage: BlitzPage = () => {
  const router = useRouter()
  const [createTeamMutation] = useMutation(createTeam)

  const [orgsQuery] = useQuery(getAllOrgs, {}, { suspense: false })
  const [orgsSelectItems, setOrgsSelectItems] = useState<SelectItem[]>([])
  useEffect(() => {
    if (orgsQuery)
      setOrgsSelectItems(orgsQuery.map((org) => ({ value: "" + org.id, label: org.name })))
  }, [orgsQuery])

  const [activitiesQuery] = useQuery(getActivities, {}, { suspense: false })
  const [activitiesSelectItems, setActivitiesSelectItems] = useState<SelectItem[]>([])
  useEffect(() => {
    if (activitiesQuery)
      setActivitiesSelectItems(
        activitiesQuery.activities.map((activity) => ({
          value: "" + activity.id,
          label: `${activity.date}: ${activity.name}`,
        }))
      )
  }, [activitiesQuery])

  const [teamName, setTeamName] = useState("")
  const [org, setOrg] = useState("")
  const [activity, setActivity] = useState("")
  const [teamMembers, setTeamMembers] = useState([])

  const [orgMembersQuery, { refetch: refetchOrgMembers }] = useQuery(
    getOrgMembers,
    {
      id: parseInt(org),
    },
    { enabled: false, suspense: false }
  )
  useEffect(() => {
    refetchOrgMembers()
  }, [org, refetchOrgMembers])
  const [orgMembersSelectItems, setOrgMembersSelectItems] = useState<SelectItem[]>([])
  useEffect(() => {
    if (orgMembersQuery) {
      setOrgMembersSelectItems(orgMembersQuery.map((om) => ({ value: "" + om.id, label: om.name })))
    }
  }, [orgMembersQuery])

  const handleSubmit = async () => {
    if (!org) return alert("Please select an Org")
    if (!activity) return alert("Please select an activity")
    if (!teamName) return alert("Please choose a team name.")
    if (teamMembers.length === 0) return alert("Please add team members")
    try {
      setIsLoading(true)
      const team = await createTeamMutation({
        orgId: parseInt(org),
        activityId: parseInt(activity),
        name: teamName,
        teamMemberIds: teamMembers.map((id) => parseInt(id)),
      })
      router.push(Routes.SubmittedTeamPage({ activityId: parseInt(activity) }))
    } catch (error: any) {
      if (error.code === "P2002") {
        alert("That team name is already taken, please pick a new one.")
      } else {
        alert(error.toString())
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  return (
    <Wrapper showNavbar={false}>
      <Suspense fallback="Loading...">
        <LoadingOverlay visible={isLoading} />
        <Text fontSize="3xl">Register for a Springfest Competition!</Text>
        <Text mb="4">All registrations are due Monday at 11:59pm!</Text>
        <Select
          label="Activity"
          placeholder="Activity the team is competing in"
          value={activity}
          onChange={setActivity as any}
          data={activitiesSelectItems}
        />
        <br />
        <Select
          label="Org"
          placeholder="Org that the team is competing for"
          value={org}
          onChange={setOrg as any}
          data={orgsSelectItems}
          searchable
        />
        <Text>
          Not a part of a org competing in Springfest? Use{" "}
          <BlitzChakraLink href={Routes.NewOrgPage()}>this link</BlitzChakraLink> to register! (even
          if it&apos;s just a group of your friends!)
        </Text>
        <br />
        <pre>
          <MultiSelect
            label="Teammates"
            placeholder={org ? "Teammates (members of your org)" : "(Please select an org first)"}
            value={teamMembers}
            onChange={setTeamMembers as any}
            data={orgMembersSelectItems}
            searchable
            nothingFound="No options"
          />
        </pre>
        <br />
        <FormLabel>
          Team Name
          <Input
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value.replace(/[^A-Za-z0-9 ,]/, ""))}
          />
        </FormLabel>
        <Button onClick={handleSubmit}>Register Team</Button>
      </Suspense>
    </Wrapper>
  )
}

NewTeamPage.authenticate = true // comment out to allow laymen to create a team
NewTeamPage.suppressFirstRenderFlicker = true
NewTeamPage.getLayout = (page) => <Layout title={"Team Registration"}>{page}</Layout>

export default NewTeamPage
