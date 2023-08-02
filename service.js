const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 4000;
const url = 'https://www.actian.com/company/careers';

app.get('/open-positions', async (req, res) => {
  const department = req.query.department;
  
  if (!department) {
    return res.status(400).send('Department is required!');
  }

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const departmentSec= $(`div.department:contains('${department}')`);
    if (departmentSec.length === 0) {
        return res.status(404).send('No department found!');
      }
      else{
    $('div.job-posting').each((_, element) => {
      const departmentName =$(element).find('div.department').text().trim()
      if (departmentName == department){
      const jobTitles = $(element).find('div.job-name').map((_, job) => $(job).text().trim()).get();
      res.status(200).json(jobTitles);
      }
    });
}
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred ');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
