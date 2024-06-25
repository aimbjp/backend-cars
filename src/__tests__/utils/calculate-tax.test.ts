import { calculateTax } from '../../utils/calculate-tax';

test('calculates tax correctly', () => {
    expect(calculateTax(1235)).toBe(1);
    expect(calculateTax(2477)).toBe(9);
    expect(calculateTax(0)).toBe(0);
    expect(calculateTax(440)).toBe(440);
});
