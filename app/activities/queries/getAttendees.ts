import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetAttendees = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetAttendees), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const members = await db.student.findMany({
    where: { activities: { some: { id } } },
    select: { tuid: true, name: true, orgs: { select: { id: true, name: true } } },
    // include: { orgs: { select: { id: true, name: true } } },
  })

  // if (!members) throw new NotFoundError()

  return members
})
