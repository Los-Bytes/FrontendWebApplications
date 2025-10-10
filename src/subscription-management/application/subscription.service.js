import { SubscriptionAssembler } from '../infrastructure/subscription.assembler.js'
import { SubscriptionManagementApi } from '../infrastructure/subscription-management.api.js'

export class SubscriptionService {
    constructor() {
        this.api = new SubscriptionManagementApi()
    }

    listAll() {
        return this.api.getAll()
            .then(response => SubscriptionAssembler.toEntitiesFromResponse(response))
    }

    getById(id) {
        return this.api.getById(id)
            .then(response => {
                if (response.status !== 200) throw new Error('Not found')
                return SubscriptionAssembler.toEntityFromResource(response.data)
            })
    }

    create(command) {
        const payload = {
            userId: command.userId,
            plan: command.plan,
            startDate: command.startDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString()
        }
        return this.api.create(payload)
            .then(response => SubscriptionAssembler.toEntityFromResource(response.data))
    }

    update(command) {
        const payload = {
            id: command.id,
            userId: command.userId,
            plan: command.plan,
            startDate: command.startDate.toISOString(),
            status: command.status,
            trialEndDate: command.trialEndDate?.toISOString()
        }
        return this.api.update(payload)
            .then(response => SubscriptionAssembler.toEntityFromResource(response.data))
    }

    cancel(id) {
        return this.getById(id)
            .then(sub => {
                sub.status = 'CANCELLED'
                return this.update(sub)
            })
    }

    delete(id) {
        return this.api.delete(id)
    }
}
