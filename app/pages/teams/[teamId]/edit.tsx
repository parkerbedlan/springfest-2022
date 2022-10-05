import { Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { LoadingOverlay, MultiSelect, Select, SelectItem } from "@mantine/core"
import getActivities from "app/activities/queries/getActivities"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Wrapper } from "app/core/components/Wrapper"
import Layout from "app/core/layouts/Layout"
import getAllOrgs from "app/orgs/queries/getAllOrgs"
import getOrgMembers from "app/orgs/queries/getOrgMembers"
import updateTeam from "app/teams/mutations/updateTeam"
import getTeam from "app/teams/queries/getTeam"
import { BlitzPage, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Suspense, useEffect, useState } from "react"

const EditTeamPage: BlitzPage = () => {
  const router = useRouter()
  const teamId = useParam("teamId", "number")
  const [teamQuery, { isLoading: teamQueryIsLoading }] = useQuery(
    getTeam,
    { id: teamId },
    {
      enabled: !!teamId,
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
      suspense: false,
    }
  )
  useEffect(() => {
    if (teamQuery) {
      setActivity("" + teamQuery.activityId)
      setOrg("" + teamQuery.orgId)
      setTeamName(teamQuery.name)
      //@ts-ignore
      setTeamMembers(teamQuery.members.map((member) => "" + member.id))
    }
  }, [teamQuery])

  const [updateTeamMutation, { isLoading: updateTeamMutationIsLoading }] = useMutation(updateTeam)

  const [orgsQuery, { isLoading: orgsQueryIsLoading }] = useQuery(
    getAllOrgs,
    {},
    { suspense: false }
  )
  const [orgsSelectItems, setOrgsSelectItems] = useState<SelectItem[]>([])
  useEffect(() => {
    if (orgsQuery)
      setOrgsSelectItems(orgsQuery.map((org) => ({ value: "" + org.id, label: org.name })))
  }, [orgsQuery])

  const [activitiesQuery, { isLoading: activitiesQueryIsLoading }] = useQuery(
    getActivities,
    {},
    { suspense: false }
  )
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
      const team = await updateTeamMutation({
        id: teamId!,
        orgId: parseInt(org),
        activityId: parseInt(activity),
        name: teamName,
        teamMemberIds: teamMembers.map((id) => parseInt(id)),
      })
      router.push(Routes.ShowTeamPage({ teamId: teamId! }))
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
  useEffect(() => {
    setIsLoading(
      orgsQueryIsLoading ||
        teamQueryIsLoading ||
        activitiesQueryIsLoading ||
        updateTeamMutationIsLoading
    )
  }, [
    orgsQueryIsLoading,
    teamQueryIsLoading,
    activitiesQueryIsLoading,
    updateTeamMutationIsLoading,
  ])

  return (
    <Wrapper showNavbar={false}>
      <Suspense fallback="Loading...">
        <LoadingOverlay visible={isLoading} />
        <Text fontSize="3xl" mb="4">
          Register for a Springfest Competition!
        </Text>
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

// EditTeamPage.authenticate = true
EditTeamPage.suppressFirstRenderFlicker = true
EditTeamPage.getLayout = (page) => <Layout title={"Team Registration"}>{page}</Layout>

export default EditTeamPage
