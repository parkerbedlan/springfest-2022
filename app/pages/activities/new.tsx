import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createActivity from "app/activities/mutations/createActivity"
import { ActivityForm, FORM_ERROR } from "app/activities/components/ActivityForm"

const NewActivityPage: BlitzPage = () => {
  const router = useRouter()
  const [createActivityMutation] = useMutation(createActivity)

  return (
    <div>
      <h1>Create New Activity</h1>

      <ActivityForm
        submitText="Create Activity"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateActivity}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const activity = await createActivityMutation(values)
            router.push(Routes.ShowActivityPage({ activityId: activity.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.ActivitiesPage()}>
          <a>Activities</a>
        </Link>
      </p>
    </div>
  )
}

NewActivityPage.authenticate = true
NewActivityPage.getLayout = (page) => <Layout title={"Create New Activity"}>{page}</Layout>

export default NewActivityPage
