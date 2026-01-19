const express = require("express");
const router = express.Router();
const fs = require("fs");
const randomstring = require("randomstring");
const Joi = require("joi");
const logger = require("../utils/logger");

function loadData() {
  return JSON.parse(fs.readFileSync("./data/data.json", "utf8"));
}

router.get("/kpi", (req, res) => {
  const data = loadData();

  let totalRevenue = 0;
  let totalCost = 0;
  let itemsSold = 0;

  data.forEach((item) => {
    item.item_list.forEach((entry) => {
      if (entry.sold) {
        itemsSold++;
        totalRevenue += item.selling_price;
      }
      totalCost += item.price;
    });
  });

  res.json({
    revenue: totalRevenue,
    cost: totalCost,
    net: totalRevenue - totalCost,
    items_sold: itemsSold,
  });
});

router.get("/net-graph", (req, res) => {
  const data = loadData();
  const map = {};

  data.forEach(item => {
    item.item_list.forEach(entry => {

      // Decide which date to use
      const dateSource = entry.sold && entry.date_out
        ? entry.date_out
        : entry.date_in;

      if (!dateSource) return;

      const day = dateSource.split("T")[0];

      if (!map[day]) {
        map[day] = {
          revenue: 0,
          cost: 0,
          sold_count: 0,
          unsold_count: 0
        };
      }

      if (entry.sold) {
        map[day].revenue += item.selling_price;
        map[day].cost += item.price;
        map[day].sold_count += 1;
      } else {
        map[day].unsold_count += 1;
      }
    });
  });

  const result = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b)) // chronological order
    .map(([date, v]) => ({
      date,
      revenue: v.revenue,
      cost: v.cost,
      net: v.revenue - v.cost,
      sold_count: v.sold_count,
      unsold_count: v.unsold_count
    }));

  res.json(result);
});


router.get("/sales-distribution", (req, res) => {
  const data = loadData();

  const result = data.map((item) => {
    const sold = item.item_list.filter((i) => i.sold).length;
    const total = item.item_list.length;

    return {
      item_name: item.item_name,
      sold,
      total,
      percentage: total === 0 ? 0 : Number(((sold / total) * 100).toFixed(2)),
    };
  });

  res.json(result);
});

module.exports = router;
