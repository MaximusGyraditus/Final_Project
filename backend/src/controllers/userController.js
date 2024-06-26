import User from "../models/userModel.js";
import Group from "../models/groupModel.js";

export const getUser = async (req, res) => { //ถ้าหาเจอ return json หาไม่เจอ return 400
  const user = await User.find({name: req.params.user},  { name: 1, score: 1, group :1 });
  if(user.length === 0){
    res.status(400).json({error : "This Username is not available"});
  }
  else res.status(200).json(user);
};


export const getRank = async (req, res) => {
  try {
    const rankedUser = await User.find({}, { name: 1, score: 1 }).sort({ score: -1 }).limit(100);
    res.status(200).json(rankedUser)
  }
  catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
}

export const updateScore = async (req, res) => {
  try {
    const oldScore = await User.findOne({name : req.body.name});
    const user = await User.updateOne({name: req.body.name} , {$set: {score : req.body.score} } );
    const group = await Group.updateOne({group: req.body.group}, { $inc: { score : req.body.score-oldScore.score}});
    res.status(200).json({ message: "OK" });

  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordMatch = user.password === req.body.password;
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    return res.status(200).json({ message: "Login successful" });
  } 

  catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  const user = await User.find({name : req.body.name});
  if(user.length > 0){
    res.status(401).json({error : "This Username is available"});
  }
  else{
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({ message: "OK" });
  }
};


export const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};
