const Round = require("../models/Round");

let forcedResult = null;

/* ================= SET RESULT ================= */

exports.setResult = async (req, res) => {

  try {

    const { number } = req.body;

    if(number === undefined){
      return res.json({
        success:false,
        message:"Number required"
      });
    }

    forcedResult = Number(number);

    res.json({
      success:true,
      message:"Result override set",
      forcedResult
    });

  } catch(err){

    res.json({
      success:false,
      message:err.message
    });

  }

};


/* ================= GET RESULT ================= */

exports.getForcedResult = () => forcedResult;


/* ================= CLEAR RESULT ================= */

exports.clearForcedResult = () => {

  forcedResult = null;

};