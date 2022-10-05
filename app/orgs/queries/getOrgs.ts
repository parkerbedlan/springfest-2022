import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import updateAllOrgPoints from "../mutations/updateAllOrgPoints"

interface GetOrgsInput
  extends Pick<Prisma.OrgFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetOrgsInput, ctx) => {
    await updateAllOrgPoints(null, ctx)

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: orgs,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.org.count({ where }),
      query: (paginateArgs) => db.org.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      orgs,
      nextPage,
      hasMore,
      count,
    }
  }
)
