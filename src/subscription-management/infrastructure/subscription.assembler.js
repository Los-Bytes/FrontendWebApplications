import { Subscription } from '../domain/model/subscription.entity.js'

export class SubscriptionAssembler {
    static toEntityFromResource(r) {
        return new Subscription({
            id: r.id,
            userId: r.userId,
            plan: r.plan,
            startDate: new Date(r.startDate),
            status: r.status,
            trialEndDate: r.trialEndDate ? new Date(r.trialEndDate) : null
        })
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`)
            return []
        }
        const data = Array.isArray(response.data)
            ? response.data
            : response.data['subscriptions']
        return data.map(r => this.toEntityFromResource(r))
    }
}
