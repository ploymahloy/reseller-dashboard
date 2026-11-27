export const asMoney = (value: string): number => Number(value);

export const formatCost = (cost: number): string => {
    return cost.toLocaleString("en-US", { style: "currency", currency: "USD" });
}