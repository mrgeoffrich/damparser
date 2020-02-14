import axios from 'axios';
import { JSDOM } from 'jsdom';
import Influx, { InfluxDB, FieldType } from 'influx';
import { MainRunner } from './main';

const influx = new InfluxDB({
  host: 'localhost',
  database: 'damlevels_db',
  schema: [
    {
      measurement: 'ml',
      fields: {
        current: FieldType.INTEGER,
        total: FieldType.INTEGER
      },
      tags: [
        'dam'
      ]
    }
  ]
});

new MainRunner().Run().then(() => {
  console.log('Finished');
}).catch((err: any) => {
  console.error(err.message);
});