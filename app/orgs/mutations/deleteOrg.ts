import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteOrg = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteOrg), resolver.authorize(), async ({ id }) => {
  const org = await db.org.deleteMany({ where: { id } })

  return org
})
