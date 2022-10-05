import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getActivity from "app/activities/queries/getActivity"
import updateActivity from "app/activities/mutations/updateActivity"
import { ActivityForm, FORM_ERROR } from "app/activities/components/ActivityForm"

export const EditActivity = () => {
  const router = useRouter()
  const activityId = useParam("activityId", "number")
  const [activity, { setQueryData }] = useQuery(
    getActivity,
    { id: activityId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateActivityMutation] = useMutation(updateActivity)

  return (
    <>
      <Head>
        <title>Edit Activity {activity.id}</title>
      </Head>

      <div>
        <h1>Edit Activity {activity.id}</h1>
        <pre>{JSON.stringify(activity, null, 2)}</pre>

        <ActivityForm
          submitText="Update Activity"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateActivity}
          initialValues={activity}
          onSubmit={async (values) => {
            try {
              const updated = await updateActivityMutation({
                id: activity.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowActivityPage({ activityId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditActivityPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditActivity />
      </Suspense>

      <p>
        <Link href={Routes.ActivitiesPage()}>
          <a>Activities</a>
        </Link>
      </p>
    </div>
  )
}

EditActivityPage.authenticate = true
EditActivityPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditActivityPage
