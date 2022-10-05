import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const TeamPresence = z.object({
  id: z.number(),
  present: z.boolean(),
})

const UpdateActivityTeamsPresence = z.object({
  teamPresenceList: z.array(TeamPresence),
})

export default resolver.pipe(
  resolver.zod(UpdateActivityTeamsPresence),
  resolver.authorize(),
  async ({ teamPresenceList }) => {
    teamPresenceList.forEach(async (team) => {
      await db.team.update({
        where: { id: team.id },
        data: { present: team.present, placement: team.present ? undefined : null },
      })
    })
  }
)
