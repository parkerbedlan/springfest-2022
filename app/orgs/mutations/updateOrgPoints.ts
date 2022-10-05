import getOrgPoints from "app/orgs/queries/getOrgPoints"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateOrgPoints = z.object({
  orgId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateOrgPoints),
  resolver.authorize(),
  async ({ orgId }, ctx) => {
    const points = await getOrgPoints({ orgId }, ctx)
    await db.org.update({ where: { id: orgId }, data: { points } })
  }
)
