import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"
import updateOrgPoints from "../mutations/updateOrgPoints"

const GetOrg = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetOrg), resolver.authorize(), async ({ id }, ctx) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  if (!id) throw Error("id is required")

  await updateOrgPoints({ orgId: id }, ctx)
  const org = await db.org.findFirst({ where: { id } })

  if (!org) throw new NotFoundError()

  return org
})
