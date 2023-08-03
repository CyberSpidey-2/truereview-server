const Shop = require("../models/shopModel");
const ErrorResponse = require("../utils/errorResponse");

//single shop
exports.singleShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id); // accessing shop by shop id (basically shows the details of the shop which is clicked )
    const totalStars = shop.totalStars;
    const totalUsers = shop.totalUsers;
    let rating = 0;
    if (totalUsers > 0) rating = (totalStars / totalUsers).toFixed(1);

    res.status(200).json({
      success: true,
      shop,
      totalStars: shop.totalStars,
      totalUsers: shop.totalUsers,
      rating: rating,
    });
  } catch (error) {
    next(error);
  }
};

//show shops by id.
exports.showShops = async (req, res, next) => {
  //enable search
  const keyword = req.query.keyword
    ? {
        shopName: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // for searching for a keyword , we could have indexed the "shopName" as well, ut since it's a write intensive collection,
  // it wont be space efficient to approach this way.
  let sorting = req.query.sort;
  if (sorting === "oldest") sorting = 1;
  else sorting = -1;
  // console.log(sorting);

  // filter shops by category ids
  let ids = [];
  const shopTypeCategory = await Shop.find({}, { category: 1 });
  shopTypeCategory.forEach((cat) => {
    ids.push(cat.category);
  });

  let cat = req.query.cat;
  let categ = cat !== "" ? cat : ids;

  if (cat === undefined)
    // when there is no querry for category , it becomes undefined => in case of no query for category we search every category
    categ = ids;

  //console.log(categ);

  //shops by location
  let locations = [];
  const shopByLocation = await Shop.find({}, { location: 1 });
  shopByLocation.forEach((val) => {
    locations.push(val.location);
  });
  let setUniqueLocation = [...new Set(locations)];
  let location = req.query.location;
  let locationFilter = location !== "" ? location : setUniqueLocation;

  if (location === undefined)
    // same undefined case vala reason like category filter
    locationFilter = setUniqueLocation;
  console.log(locationFilter);

  //enable pagination
  const { pageIndex = 1, pageSize = 5 } = req.query;
  //const count = await Shop.find({}).estimatedDocumentCount();
  const count = await Shop.find({
    ...keyword,
    category: categ,
    location: locationFilter,
  }).countDocuments();

  try {
    const shops = await Shop.find({
      ...keyword,
      category: categ,
      location: locationFilter,
    })
      .sort({ createdAt: sorting })
      .skip(pageSize * (pageIndex - 1))
      .limit(pageSize);
    res.status(200).json({
      success: true,
      shops,
      pageIndex,
      pages: Math.ceil(count / pageSize),
      count,
      setUniqueLocation,
    });
  } catch (error) {
    next(error);
  }
};
