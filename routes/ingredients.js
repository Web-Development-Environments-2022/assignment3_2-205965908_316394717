const express = require("express");
const router = express.Router();
const dbUtils = require("./utils/DButils");

router.get("/", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (!user_id) throw {status: 401, message: "Need to login"};
        let select_query = `SELECT * FROM ingredients`;
        let ingredients = await dbUtils.execQuery(select_query);
        res.status(200).send(ingredients);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
