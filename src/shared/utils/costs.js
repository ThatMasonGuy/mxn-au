export function calculateOpenAICost({ input = 0, output = 0 }) {
    const cost = (input * 0.0004 + output * 0.0016) / 1000
    return Number(cost.toFixed(6)) // USD
}
