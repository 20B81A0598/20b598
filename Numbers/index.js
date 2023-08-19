const exp = require("express");
const axi = require("axios");

const app = exp();
const portno = 3000;

app.get("/numbers", async (req, res) => {
  const urlParams = req.query.url;

  if (!urlParams || !Array.isArray(urlParams)) {
    return res.status(400).json({ error });
  }

  const nopros = urlParams.map(async (url) => {
    try {
      const response = await axi.get(url);
      const data = response.data;
      if (data && data.numbers && Array.isArray(data.numbers)) {
        return data.numbers;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error  ${url}: ${error.message}`);
      return [];
    }
  });

  try {
    const numberarrs = await Promise.all(nopros);
    const merges = numberarrs.reduce((acc, numbers) => acc.concat(numbers), []);
    const uniqueSortedNumbers = [...new Set(merges)].sort((a, b) => a - b);

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "error" });
  }
});

app.listen(portno, () => {
  console.log(`running on portno ${portno}`);
});
