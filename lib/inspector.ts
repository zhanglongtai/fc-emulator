import { injectable } from 'inversify'

type logArgs = Parameters<typeof console.log>
@injectable()
export class Inspector {
    private isLodDisabled = false
    public disabledLog() {
        this.isLodDisabled = true
    }
    log(...o: logArgs) {
        if (this.isLodDisabled) {
            return
        }
        console.log(...o)
    }
}
