import { useFlagIcon } from './useFlagIcon'

export function formatPlayerName(name, row) {
    const flagClass = useFlagIcon(row?.Country)
    return flagClass
        ? `<span class="inline-block mr-1 w-5 h-4 align-middle ${flagClass}"></span>${name}`
        : name
}
