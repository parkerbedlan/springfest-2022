import getOrgAttendanceByActivity from "app/orgs/queries/getOrgAttendanceByActivity"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

// TODO: also return a report explaining how they have that many points, for points tab

const GetOrgPoints = z.object({
  orgId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetOrgPoints),
  resolver.authorize(),
  async ({ orgId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const attendanceByActivity = await getOrgAttendanceByActivity({ orgId }, ctx)
    const attendancePointsByActivity = await Promise.all(
      attendanceByActivity.map((activity): number => {
        const nums: [number, number] = activity.attendance
          .split("/")
          .map((num) => parseInt(num)) as [number, number]
        const ratio = nums[0] / nums[1]
        return ratio >= 0.35 ? 10 : 0
      })
    )
    const totalAttendancePoints = attendancePointsByActivity.reduce((ps, a) => ps + a)

    const activitiesWithPresentTeam = await db.activity.count({
      where: { teams: { some: { orgId, present: true } } },
    })
    const totalActivityPresencePoints = activitiesWithPresentTeam * 30

    const placers = await db.team.findMany({ where: { orgId, placement: { gt: 0 } } })
    let totalPlacementPoints = 0
    const placementToPoints = { 1: 50, 2: 40, 3: 30, 4: 20 }
    placers.forEach((placer) => {
      totalPlacementPoints += placementToPoints[placer.placement as number]
    })

    const totalPoints = totalAttendancePoints + totalActivityPresencePoints + totalPlacementPoints

    return totalPoints
  }
)
