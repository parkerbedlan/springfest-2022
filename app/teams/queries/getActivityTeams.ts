import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetActivityTeams = z.object({
  activityId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetActivityTeams),
  resolver.authorize(),
  async ({ activityId }) => {
    const teams = await db.team.findMany({
      where: { activityId },
    })
    return teams
  }
)
