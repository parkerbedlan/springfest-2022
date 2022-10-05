import getOrgActivityAttendance from "app/orgs/queries/getOrgActivityAttendance"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetActivityAttendanceByOrg = z.object({
  // This accepts type of undefined, but is required at runtime
  activityId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetActivityAttendanceByOrg),
  resolver.authorize(),
  async ({ activityId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const orgs = await db.org.findMany({ select: { id: true, name: true } })

    const output = await Promise.all(
      orgs.map(async (org) => {
        const attendance = await getOrgActivityAttendance({ activityId, orgId: org.id }, ctx)
        return { ...org, attendance }
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
