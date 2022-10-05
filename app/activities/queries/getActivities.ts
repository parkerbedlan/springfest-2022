import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetActivitiesInput
  extends Pick<Prisma.ActivityFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  async ({ where, orderBy, skip = 0, take = 100 }: GetActivitiesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: activities,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.activity.count({ where }),
      query: (paginateArgs) => db.activity.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      activities,
      nextPage,
      hasMore,
      count,
    }
  }
)
