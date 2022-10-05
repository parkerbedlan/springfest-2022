import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTeam = z.object({
  id: z.number(),
  placement: z.number().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateTeam),
  resolver.authorize(),
  async ({ id, placement }) => {
    await db.team.update({ where: { id }, data: { placement: placement || null } })
  }
)
