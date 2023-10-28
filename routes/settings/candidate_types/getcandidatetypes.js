const mongodbclient = require('../../dbconfig');
const settings = require("../../../settings");
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    // Get job_type_id from request parameters
    const { candidate_type_id } = req.params;

    // Check the validity of job_type_id
    if (!candidate_type_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection("master_job_types");

    const filter = candidate_type_id === '0' ? {} : { _id: new ObjectId(candidate_type_id) };

    // Find documents that match the filter
    const results = await collection.find(filter).sort({ last_updated: -1 }).toArray();

    // Send successful response with result documents
    res.status(200).json({ type: "SUCCESS", data: results });

    // Close the MongoDB client when done
    client.close();
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: "ERROR", message: error.message });
  }
};


