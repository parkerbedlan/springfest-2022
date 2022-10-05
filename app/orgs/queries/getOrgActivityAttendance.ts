import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetOrgActivityAttendance = z.object({
  orgId: z.number(),
  activityId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetOrgActivityAttendance),
  resolver.authorize(),
  async ({ orgId, activityId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const membersAttended = await db.student.count({
      where: { orgs: { some: { id: orgId } }, activities: { some: { id: activityId } } },
    })
    const membersTotal = await db.student.count({ where: { orgs: { some: { id: orgId } } } })

    return `${membersAttended}/${membersTotal}`
  }
)
