const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fb = admin.database();

exports.createFakeItems = functions.https.onRequest((req, res) => {
  const createCount = 3000;

  const batchDetail = [];
  const batch = [];
  for (step = 0; step < createCount; step++) {
    const refDetail = fb.ref('items-detailed').push();
    const ref = fb.ref('items').push();

    const light = {
      tagIDNumber: Math.random(),
      name: 'Doe, John',
      dateOfBirth: new Date(),
      expirationDate: new Date(),
      detailKey: refDetail.key
    }

    const detail = {
      createdDate: admin.database.ServerValue.TIMESTAMP,
      createdBy: 'Server Import',
      modifiedDate: admin.database.ServerValue.TIMESTAMP,
      modifiedBy: 'Server Import',
      invoiceNumber: Math.random(),
      invoicePaymentMethod: 'PO',
      invoicePaymentDate: null,

      tagIDNumber: light.tagIDNumber,
      lastName: 'Doe',
      firstName: 'John',
      sex: 'Unknown',
      dateOfBirth: light.dateOfBirth,
      email: 'blank@blank.com',
      cellNumber: '123-123-1234',
      address: {
        street: '123 Main Street',
        city: 'Denver',
        state: 'CO',
        zip: '80111',
      },
      localAddress: {
        street: '123 Main Street',
        city: 'Denver',
        state: 'CO',
        zip: '80111',
      },
      lightKey: ref.key
    };

    batchDetail.push(refDetail.set(detail));
    batch.push(ref.set(light));
  };

  try {
    return Promise.all(batchDetail)
      .then(() => Promise.all(batch))
      .then(() => res.send('Success! ' + createCount + ' Items Created.'));
  } catch (error) {
    console.error('Error importing to Firestore!', error);
    return res.status(500).send('Import Failed!');
  }
});
