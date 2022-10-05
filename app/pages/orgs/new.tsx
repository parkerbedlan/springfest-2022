import { Button, FormLabel, Input, Text } from "@chakra-ui/react"
import { LoadingOverlay, MultiSelect, SelectItem } from "@mantine/core"
import { Wrapper } from "app/core/components/Wrapper"
import Layout from "app/core/layouts/Layout"
import createOrg from "app/orgs/mutations/createOrg"
import getAllStudents from "app/students/queries/getAllStudents"
import { BlitzPage, Routes, useMutation, useQuery, useRouter } from "blitz"
import { useEffect, useState } from "react"

const NewOrgPage: BlitzPage = () => {
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
  const [createOrgMutation, { isLoading: createOrgIsLoading }] = useMutation(createOrg)

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
      const org = await createOrgMutation({ name: orgName, studentIds: membersParsed })
      router.push(Routes.SubmittedPage())
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
    setIsLoading(createOrgIsLoading || studentsQueryIsLoading)
  }, [createOrgIsLoading, studentsQueryIsLoading])

  return (
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
        Note: If you can&apos;t find someone, try typing their last name. (Middle names and
        nicknames are not stored.)
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
        Register Org
      </Button>
    </Wrapper>
  )
}

NewOrgPage.authenticate = true // comment out to allow laymen to create an org
NewOrgPage.getLayout = (page) => <Layout title={"Org Registration"}>{page}</Layout>

export default NewOrgPage
