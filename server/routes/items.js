const { time } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const randomstring = require("randomstring");
const Joi = require('joi');
const logger = require("../utils/logger");

function loadData() {
  return JSON.parse(fs.readFileSync("./data/data.json", "utf8"));
}

router.get("/raw", async (req, res) => {
  const schema = Joi.object({
    item_name: Joi.string().valid("battery", "panel", "tire").optional(),
    quantity: Joi.number().optional(),
    item_code: Joi.string().optional(),
    price: Joi.number().optional()
  })
  const {error} = schema.validate();
  if(error) return res.status(400).send(error.details[0].message)

  const data = loadData();

  const updatedDate = data.map(item => {
    const sold_stock = ((item.item_list).filter(item_list => item_list.sold == true)).length;
    const total_stock = item.item_list.length
    return{
      ...item,
      in_stock:total_stock-sold_stock,
      sold_stock:sold_stock,
      total_stock:total_stock
    }
  })
  res.send(updatedDate);
});

router.get("/aggregated", (req, res) => {
  const data = loadData();

  const result = data.map(item => {
    const sold = item.item_list.filter(i => i.sold).length;
    const total = item.item_list.length;

    return {
      item_name: item.item_name,
      item_code: item.item_code,
      price: item.price,
      selling_price: item.selling_price,
      in_stock: total - sold,
      sold,
      total
    };
  });

  res.json(result);
});

router.post("/", async (req, res) => {
  const error = validateSchema(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const data = loadData();
  const request = req.body;

  const updatedData = data.map((item) => {
    if (item.item_name == request.item_name) {
      var updateItemList = [];
      for (let i = 0; i < request.quantity; i++) {
        const timestamp = new Date(Date.now());
        const date = timestamp.toISOString();

        updateItemList.push({
          date_in: date,
          item_number: randomstring.generate(12),
          sold: false,
        });
      }

      return (updateItemList = {
        ...item,
        item_list: [...item.item_list, ...updateItemList],
      });
    } else {
      return item;
    }
  });

  console.log(updatedData)
  fs.writeFileSync("./data/data.json", JSON.stringify(updatedData));
  res.send(updatedData);
});

router.put("/config/:item_name", async (req, res) => {
  const error = validateSchema(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  
  const data = loadData();
  const request = req.body;
  const itemName = req.params.item_name;

  const updatedData = data.map((item) => {
    if (item.item_name != itemName) {
      return item;
    }

    return {
      ...item,
      item_name: itemName,
      item_code: request.item_code,
      price: request.price,
      selling_price: request.selling_price,
    };
  });

  fs.writeFileSync("./data/data.json", JSON.stringify(updatedData));
  res.send(updatedData);
});

function validateSchema(requestBody){
  console.log(requestBody)
  const schema = Joi.object({
    item_name: Joi.string().valid("battery", "panel", "tire").optional(),
    quantity: Joi.number().optional(),
    item_code: Joi.string().optional(),
    price: Joi.number().optional(),
    selling_price: Joi.number().optional(),
  })
  const {error} = schema.validate(requestBody);
  if(error) logger.error(error.details[0].message)
  return error
}

module.exports = router;
