import updateOrgPoints from "app/orgs/mutations/updateOrgPoints"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const orgs = await db.org.findMany({ select: { id: true } })
  orgs.map((org) => updateOrgPoints({ orgId: org.id }, ctx))
})
