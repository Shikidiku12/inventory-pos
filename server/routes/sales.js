const express = require("express");
const router = express.Router();
const fs = require("fs");
const randomstring = require("randomstring");
const Joi = require('joi');
const logger = require("../utils/logger");

function loadData() {
  return JSON.parse(fs.readFileSync("./data/data.json", "utf8"));
}

router.put("/:item_name", async (req, res) => {
  const error = validateSchema(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const data = loadData();
  const request = req.body;
  const itemName = req.params.item_name;
  const quantity = request.quantity

  const item = data.find(i => i.item_name === itemName);
  if (!item) return res.status(404).send("Item not found");

  const available = item.item_list.filter(item_list => !item_list.sold).length;
  if (available < quantity) {
    return res.status(400).send(`Not enough stock. Available=${available}, requested=${quantity}`);
  }

  const updatedData = data.map((item) => {
    if (item.item_name != itemName) {
      return item;
    }

    let remaining = quantity;

    const item_list = item.item_list.map(item_list => {
      if(item_list.sold || remaining==0){
        return item_list
      }
      
      remaining--;

      return {
        ...item_list,
        sold: true,
        date_out: new Date().toISOString(),
      };
    })

    return {
      ...item,
      item_list:item_list
    };
  });

  fs.writeFileSync("./data/data.json", JSON.stringify(updatedData));
  res.send(updatedData);
});

router.get("/history", (req, res) => {
  const { item_name, from, to } = req.query;
  const data = loadData();

  let history = [];

  data.forEach(item => {
    if (item_name && item.item_name !== item_name) return;

    item.item_list.forEach(entry => {
      if (!entry.sold) return;

      // date_out filters (sale date)
      if (from && entry.date_out < from) return;
      if (to && entry.date_out > to) return;

      history.push({
        item_name: item.item_name,
        item_code: item.item_code,
        item_number: entry.item_number,

        date_in: entry.date_in,       // ✅ added
        date_out: entry.date_out,

        cost: item.price,
        selling_price: item.selling_price,
        profit: item.selling_price - item.price
      });
    });
  });

  res.json(history);
});

module.exports = router;