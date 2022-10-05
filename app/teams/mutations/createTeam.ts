import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTeam = z.object({
  name: z.string(),
  orgId: z.number(),
  activityId: z.number(),
  teamMemberIds: z.array(z.number()),
})

export default resolver.pipe(
  resolver.zod(CreateTeam),
  resolver.authorize(), // comment out to allow laymen to create a team
  async ({ name, orgId, activityId, teamMemberIds }) => {
    const team = await db.team.create({
      data: {
        name: name.trim(),
        orgId,
        activityId,
        members: { connect: teamMemberIds.map((id) => ({ id })) },
      },
    })

    return team
  }
)
