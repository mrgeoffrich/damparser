import axios from 'axios';
import { JSDOM } from 'jsdom';

axios.get('https://www.seqwater.com.au/dam-levels').then((p) => {
  const responseString = p.data.toString();
  const dom = new JSDOM(p.data.toString());
  const scriptContents = dom.window.document.querySelector("script[data-drupal-selector=\"drupal-settings-json\"");
  if (scriptContents != null) {
    const jsonData = JSON.parse(scriptContents.innerHTML);
    let damLevels = jsonData.seqw_dam_levels.amcharts[0].chart_data;
    console.log(JSON.stringify(damLevels, null, 4));
  }
  console.log('Finished.')
});