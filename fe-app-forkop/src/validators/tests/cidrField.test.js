import { describe, expect, it } from 'vitest';
import { cidrField } from '../fields';

describe('cidrField', () => {
  it('leaves an empty value to the field', () => {
    expect(cidrField(4)('s', '')).toBe(true);
    expect(cidrField(6)('s', undefined)).toBe(true);
  });

  it('accepts a subnet of the asked family with a prefix length', () => {
    expect(cidrField(4)('s', '198.18.0.0/15')).toBe(true);
    expect(cidrField(4)('s', ' 198.18.0.0/16 ')).toBe(true);
    expect(cidrField(6)('s', 'fd00:18::/64')).toBe(true);
  });

  it('refuses the other family, a bare address and a prefix out of range', () => {
    expect(cidrField(4)('s', 'fc00::/112')).toMatch(/IPv4 CIDR/);
    expect(cidrField(6)('s', '198.18.0.0/16')).toMatch(/IPv6 CIDR/);
    expect(cidrField(4)('s', '198.18.0.0')).toMatch(/IPv4 CIDR/);
    expect(cidrField(6)('s', 'fc00::')).toMatch(/IPv6 CIDR/);
    expect(cidrField(4)('s', '198.18.0.0/33')).not.toBe(true);
    expect(cidrField(6)('s', 'fc00::/129')).not.toBe(true);
  });
});
