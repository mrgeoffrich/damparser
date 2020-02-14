import axios from 'axios';
import { JSDOM } from 'jsdom';
import Influx, { InfluxDB, FieldType } from 'influx';

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

export class MainRunner {
  public async Run () {
    const names = await influx.getDatabaseNames();
    if (!names.includes('damlevels_db')) {
      return influx.createDatabase('damlevels_db');
    }
    const getResponse = await  axios.get('https://www.seqwater.com.au/dam-levels');
    const dom = new JSDOM(getResponse.data.toString());
    const scriptContents = dom.window.document.querySelector("script[data-drupal-selector=\"drupal-settings-json\"");
    if (scriptContents != null) {
      const jsonData = JSON.parse(scriptContents.innerHTML);
      let damLevels = jsonData.seqw_dam_levels.amcharts[0].chart_data;
      for (let index = 0; index < damLevels.length; index++) {
        const element = damLevels[index];
        let ml = parseInt((element.ml as string).replace(',','').replace(' ',''));
        let ml_cap = parseInt(element.ml_cap);
        await influx.writePoints([
          {
            measurement: 'ml',
            tags: { dam: element.name },
            fields: {
              current: ml,
              total: ml_cap
            },
          }]);
      }
    }
  }
}