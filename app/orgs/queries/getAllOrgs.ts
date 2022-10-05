import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

export default resolver.pipe(resolver.zod(z.object({})), async () => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const orgs = await db.org.findMany({ select: { id: true, name: true } })
  return orgs
})
