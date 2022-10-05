import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetOrgMembers = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetOrgMembers), async ({ id }, ctx) => {
  const members = await db.student.findMany({
    where: { orgs: { some: { id } } },
    select: { id: true, name: true, tuid: ctx.session.$isAuthorized() },
  })

  // if (!members) throw new NotFoundError()

  return members
})
