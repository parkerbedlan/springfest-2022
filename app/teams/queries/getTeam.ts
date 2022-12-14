import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTeam = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTeam), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const team = await db.team.findFirst({
    where: { id },
    include: { members: { select: { id: true } } },
  })

  if (!team) throw new NotFoundError()

  return team
})
