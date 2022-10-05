import getOrgActivityAttendance from "app/orgs/queries/getOrgActivityAttendance"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetOrgAttendanceByActivity = z.object({
  orgId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetOrgAttendanceByActivity),
  resolver.authorize(),
  async ({ orgId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const activities = await db.activity.findMany({ select: { id: true, name: true } })

    const output = await Promise.all(
      activities.map(async (activity) => {
        const attendance = await getOrgActivityAttendance({ orgId, activityId: activity.id }, ctx)
        return { ...activity, attendance }
      })
    )

    return output

    // const membersAttended = await db.student.count({
    //   where: { orgs: { some: { id: orgId } }, activities: { some: { id: activityId } } },
    // })
    // const membersTotal = await db.student.count({ where: { orgs: { some: { id: orgId } } } })

    // return `${membersAttended}/${membersTotal}`
  }
)
