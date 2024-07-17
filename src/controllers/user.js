const User = require("../models/user");
const { comparePassword, hashPassword } = require("../utils/password");
const {createJwtToken} = require("../middlewares/auth")
const {validateFields, validateFound, validateId} = require('../validators/commonValidations')
const accountSid = 'AC72d0559abce83ec68e1f701d7d925245';
const authToken = '8951aedb65930b3958f5bcd680fd8b0a';
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

exports.user = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if(!name || !email || !password || !phone  || !role) return validateFields(res);
    const hashedPassword = await hashPassword(password);
    const request = {
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role,
    };

    let user = await User.create(request);
    return res.status(200).send({ user, message: "Signup Successfully" });
  } catch (error) {
    console.log("error");
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return validateFields(res);

    const user = await User.findOne({ email: email});
    if (!user || !user.password) {
        return res.status(400).send({
          error: "The credentials you provided are incorrect, please try again.",
        });
      }
   
      const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(400).send({
        error: "The credentials you provided are incorrect, please try again.",
      });
      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone : user.phone,
        role : user.role
      };
     
      const token = createJwtToken(payload);
      if (token) {
        payload["token"] = token;
      }

      return res.status(200).send({ user: payload, message: "Successfully logged in" });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return res.status(200).send({ profile: userProfile });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something broke" });
  }
}; 


// exports.sendMessage = async(req,res)=>{
//   try{
//     client.messages.create({
//       body : req.body.message,
//       from : 'whatsapp:+14155238886',
//       to : 'whatsapp: '+req.body.to
//     }).then(message => console.log("message sent successfully"))
//     return res.status(200).send({success : true, msg : "message sent successfully"})
//   }catch(error){
//     console.log(error);
//     return res.status(500).send({error : error.message})
//   }
// }

exports.sendMessage = async (req, res) => {
  try {
    // Ensure 'to' is a string and remove any extra spaces
    const toNumber = String(req.body.to).trim();

    // Create the message using the correct format
    client.messages.create({
      body: req.body.message,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:' + toNumber // Ensure correct formatting
    }).then(message => console.log("message sent successfully"));

    return res.status(200).send({ success: true, msg: "message sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
}
