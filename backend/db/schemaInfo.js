const mongoose = require("mongoose");

const schemaInfo = new mongoose.Schema({
    version: String,
    load_data_time : {type: Date, default: Date.now},
})

const SchemaInfo = mongoose.model("SchemaInfo", schemaInfo);

module.exports = SchemaInfo;