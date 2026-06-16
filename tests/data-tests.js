'use strict';

const { faker } = require('@faker-js/faker');
const {
    setPerson,
    getPersons,
    getPerson,
    deletePersons,
} = require('../data/index');

const { getConnection } = require('../data/connection');
const expect = require('chai').expect;

describe('Data Tests', function () {
    this.timeout(10000);

    before(async () => {
        await getConnection();
        await deletePersons();
    });

    after(async () => {
        const connection = await getConnection();
        await connection.disconnect();
    });

    it('Can connect to DB', async () => {
        const connection = await getConnection();
        expect(connection).to.be.an('object');
    });

    it('Can create Person to DB', async () => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        const savedPerson = await setPerson({ firstName, lastName });

        expect(savedPerson).to.be.an('object');
        expect(savedPerson.firstName).to.eq(firstName);
        expect(savedPerson.lastName).to.eq(lastName);

        const persons = await getPersons();
        expect(persons).to.be.an('array');
        expect(persons.length).to.be.greaterThan(0);

        const person = await getPerson(savedPerson.id.toString());

        expect(person).to.be.an('object');
        expect(person.id).to.eq(savedPerson.id.toString());
    });
});