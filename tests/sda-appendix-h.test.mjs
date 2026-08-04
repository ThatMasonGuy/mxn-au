import assert from 'node:assert/strict'
import test from 'node:test'

import {
    getAppendixHBedroomCapacity,
    getAppendixHParticipantLimit,
    isValidAppendixHParticipantRow,
} from '../src/features/everhomes/utils/sdaAppendixH.js'

test('Appendix H caps SDA-eligible participants at one below bedroom capacity', () => {
    const groupHome = { dwelling: 'Group Home, 5 residents', maxResidents: 5 }
    assert.equal(getAppendixHParticipantLimit(groupHome), 4)
    assert.equal(isValidAppendixHParticipantRow({ ...groupHome, sdaEligibleCount: 1 }), true)
    assert.equal(isValidAppendixHParticipantRow({ ...groupHome, sdaEligibleCount: 4 }), true)
    assert.equal(isValidAppendixHParticipantRow({ ...groupHome, sdaEligibleCount: 5 }), false)
})

test('Appendix H uses bedroom count and preserves workbook one-participant cases', () => {
    const twoBedroomOneResident = {
        dwelling: 'Apartment, 2 bedrooms, 1 resident',
        maxResidents: 1,
        sdaEligibleCount: 1,
    }
    assert.equal(getAppendixHBedroomCapacity(twoBedroomOneResident), 2)
    assert.equal(getAppendixHParticipantLimit(twoBedroomOneResident), 1)
    assert.equal(isValidAppendixHParticipantRow(twoBedroomOneResident), true)

    const oneBedroom = {
        dwelling: 'Apartment, 1 bedroom, 1 resident',
        maxResidents: 1,
        sdaEligibleCount: 1,
    }
    assert.equal(getAppendixHParticipantLimit(oneBedroom), 1)
    assert.equal(isValidAppendixHParticipantRow(oneBedroom), true)

    const threeBedroom = {
        dwelling: 'Apartment, 3 bedrooms, 2 residents',
        maxResidents: 2,
    }
    assert.equal(isValidAppendixHParticipantRow({ ...threeBedroom, sdaEligibleCount: 2 }), true)
    assert.equal(isValidAppendixHParticipantRow({ ...threeBedroom, sdaEligibleCount: 3 }), false)
    assert.equal(isValidAppendixHParticipantRow({ maxResidents: 3, sdaEligibleCount: 0 }), false)
})
