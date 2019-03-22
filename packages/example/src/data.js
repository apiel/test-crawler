import * as faker from 'faker';

faker.seed(1);

const count = 3;
const list = [];
for(let n = 0; n < count; n++) {
    list.push({
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    country: faker.address.country(),
    text: faker.lorem.paragraphs(),
    avatar: faker.internet.avatar(),
  });
}

export const data = list;