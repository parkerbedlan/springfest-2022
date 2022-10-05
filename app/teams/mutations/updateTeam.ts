import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTeam = z.object({
  id: z.number(),
  name: z.string(),
  orgId: z.number(),
  activityId: z.number(),
  teamMemberIds: z.array(z.number()),
})

export default resolver.pipe(
  resolver.zod(CreateTeam),
  async ({ id, name, orgId, activityId, teamMemberIds }) => {
    const team = await db.team.update({
      where: { id },
      data: {
        name: name.trim(),
        orgId,
        activityId,
        members: { set: [], connect: teamMemberIds.map((id) => ({ id })) },
      },
    })

    return team
  }
)
