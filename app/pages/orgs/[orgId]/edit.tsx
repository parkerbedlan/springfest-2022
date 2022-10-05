import { Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { LoadingOverlay, MultiSelect, SelectItem } from "@mantine/core"
import { Wrapper } from "app/core/components/Wrapper"
import Layout from "app/core/layouts/Layout"
import createOrg from "app/orgs/mutations/createOrg"
import updateOrg from "app/orgs/mutations/updateOrg"
import getOrg from "app/orgs/queries/getOrg"
import getOrgMembers from "app/orgs/queries/getOrgMembers"
import getAllStudents from "app/students/queries/getAllStudents"
import { BlitzPage, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Suspense, useEffect, useState } from "react"

const EditOrgPage: BlitzPage = () => {
  const orgId = useParam("orgId", "number")
  const [orgQuery, { isLoading: orgQueryIsLoading }] = useQuery(
    getOrg,
    { id: orgId },
    { enabled: !!orgId, suspense: false, staleTime: Infinity }
  )
  useEffect(() => {
    if (orgQuery) {
      setOrgName(orgQuery.name)
    }
  }, [orgQuery])
  const [orgMembersQuery, { isLoading: orgMembersQueryIsLoading }] = useQuery(
    getOrgMembers,
    {
      id: orgId,
    },
    { enabled: !!orgId, suspense: false, staleTime: Infinity }
  )
  useEffect(() => {
    if (orgMembersQuery) setOrgMembers(orgMembersQuery.map((member) => "" + member.id))
  }, [orgMembersQuery])

  const [studentsSelectItems, setStudentsSelectItems] = useState<SelectItem[]>([])
  const [studentsQuery, { isLoading: studentsQueryIsLoading }] = useQuery(
    getAllStudents,
    {},
    { suspense: false }
  )
  useEffect(() => {
    if (studentsQuery)
      setStudentsSelectItems(
        studentsQuery.map((student) => ({ value: "" + student.id, label: student.name }))
      )
  }, [studentsQuery])

  const [orgMembers, setOrgMembers] = useState<string[]>([])

  const router = useRouter()
  const [updateOrgMutation, { isLoading: updateOrgIsLoading }] = useMutation(updateOrg)

  const [orgName, setOrgName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async () => {
    console.log("submitting")
    if (!orgName) {
      setErrorMessage("Please provide a name for your org (at the top of the page)")
      return
    }
    if (orgMembers.length === 0) {
      setErrorMessage("Please add org members.")
      return
    }
    try {
      setIsLoading(true)
      const membersParsed = orgMembers.map((id) => parseInt(id))
      const org = await updateOrgMutation({ id: orgId!, name: orgName, studentIds: membersParsed })
      router.push(Routes.ShowOrgPage({ orgId: orgId! }))
    } catch (error: any) {
      if (error.code === "P2002") {
        setErrorMessage("That org name is already taken, please pick a new one.")
      } else {
        setErrorMessage(error.toString())
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(
      updateOrgIsLoading || studentsQueryIsLoading || orgQueryIsLoading || orgMembersQueryIsLoading
    )
  }, [updateOrgIsLoading, studentsQueryIsLoading, orgQueryIsLoading, orgMembersQueryIsLoading])

  return (
    <Suspense fallback="Loading">
      <Wrapper showNavbar={false}>
        <LoadingOverlay visible={isLoading} />
        <Text fontSize="3xl">Register your Org for Springfest!</Text>
        <Text mb="4">All registrations are due Monday at 11:59pm!</Text>

        <FormLabel>
          Organization Name
          <Input
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </FormLabel>

        <MultiSelect
          label="Org Members"
          placeholder={"Org Members"}
          value={orgMembers}
          onChange={setOrgMembers as any}
          data={studentsSelectItems}
          searchable
          nothingFound="No options"
        />
        <Text>
          Note: If you can&apos;t find someone, you may be typing their middle name instead of their
          first name, or they are a grad student.
        </Text>

        <Text fontSize="xl" color="red">
          {errorMessage}
        </Text>
        <Button
          my={4}
          variant="solid"
          colorScheme={"blue"}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Update Org
        </Button>
      </Wrapper>
    </Suspense>
  )
}

// EditOrgPage.authenticate = true
EditOrgPage.getLayout = (page) => <Layout title={"Org Registration"}>{page}</Layout>

export default EditOrgPage
